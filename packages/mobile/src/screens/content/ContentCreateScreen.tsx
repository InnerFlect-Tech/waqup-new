/**
 * ContentCreateScreen — Quick chat-based creation (ritual, affirmation, meditation).
 * Chat → script → Continue → CreateVoiceStep (record or AI voice) → ContentDetail.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';
import { VoiceOrb } from '@/components/audio';
import { AI_MODE_COSTS } from '@waqup/shared/constants';
import { withOpacity } from '@waqup/shared/theme';
import {
  sendConversationMessage,
  generateScript,
} from '@/services/ai';
import type { ChatMessage } from '@/services/ai';
import { useCreateContent } from '@/hooks/useContent';
import { supabase } from '@/services/supabase';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentCreate'>;

const TYPE_LABELS: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Meditation',
  ritual: 'Ritual',
};

const OPENING_PROMPT: Record<string, string> = {
  affirmation: 'What area of your life do you want to strengthen?',
  meditation: 'What state are you looking to access — sleep, calm, focus?',
  ritual: 'What transformation are you working toward?',
};

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ContentCreateScreen({ navigation, route }: Props) {
  const { contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatPhase, setChatPhase] = useState<'chatting' | 'generating' | 'done'>('chatting');
  const [generatedScript, setGeneratedScript] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [chatCostError, setChatCostError] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);
  const [continueError, setContinueError] = useState<string | null>(null);

  const { mutateAsync: createContent } = useCreateContent();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'opening',
        role: 'assistant',
        content: OPENING_PROMPT[contentType] ?? 'What would you like to create?',
      }]);
    }
  }, [contentType, messages.length]);

  const doGenerateScript = useCallback(async (chatHistory: DisplayMessage[]) => {
    setChatPhase('generating');
    const firstUserMsg = chatHistory.find(m => m.role === 'user');
    const allUserContent = chatHistory.filter(m => m.role === 'user').map(m => m.content).join(' ');
    try {
      const res = await generateScript(contentType, firstUserMsg?.content ?? allUserContent, allUserContent, () => supabase.auth.getSession());
      setGeneratedScript(res.script);
      setChatPhase('done');
    } catch {
      setChatPhase('chatting');
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: "Couldn't generate the script. Please try again.",
      }]);
    }
  }, [contentType]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading || chatPhase !== 'chatting') return;
    const userMsg: DisplayMessage = { id: Date.now().toString(), role: 'user', content: chatInput.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setChatInput('');
    setIsChatLoading(true);

    setChatCostError(null);
    try {
      const apiMessages: ChatMessage[] = nextMessages
        .filter(m => m.id !== 'opening')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const res = await sendConversationMessage(contentType, apiMessages, () => supabase.auth.getSession());

      if ('error' in res && res.error === 'insufficient_credits') {
        setChatCostError((res as { message?: string }).message ?? 'Not enough Qs. Please get more Qs to continue.');
        return;
      }
      if ('error' in res && res.error === 'Unauthorized') {
        setChatCostError('Please sign in to use AI chat.');
        return;
      }

      const assistantMsg: DisplayMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: res.reply };
      const updated = [...nextMessages, assistantMsg];
      setMessages(updated);

      if (res.shouldGenerateScript) {
        await doGenerateScript(updated);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, chatPhase, messages, contentType, doGenerateScript]);

  const handleContinue = useCallback(async () => {
    if (isContinuing || !generatedScript) return;
    setIsContinuing(true);
    setContinueError(null);
    try {
      const item = await createContent({
        type: contentType,
        title: `My ${contentType}`,
        description: '',
        script: generatedScript,
        status: 'draft',
      });
      navigation.navigate('CreateVoiceStep', { contentId: item.id, contentType, script: generatedScript });
    } catch {
      setContinueError('Could not save. Please try again.');
    } finally {
      setIsContinuing(false);
    }
  }, [contentType, generatedScript, isContinuing, createContent, navigation]);

  const handleStartOver = useCallback(() => {
    setChatPhase('chatting');
    setGeneratedScript('');
    setMessages([]);
    setContinueError(null);
  }, []);

  const creditCost = AI_MODE_COSTS.chat;
  const showChat = chatPhase !== 'done';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen scrollable={false} padding={false}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <View style={styles.navTitle}>
            {showChat && <VoiceOrb size="sm" orbState={isChatLoading || chatPhase === 'generating' ? 'thinking' : 'idle'} style={{ marginRight: spacing.sm }} />}
            <View style={{ alignItems: 'center' }}>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>
                Creating Your {TYPE_LABELS[contentType]}
              </Typography>
              <Typography variant="caption" style={{ color: colors.accent.secondary, fontSize: 11 }}>
                {creditCost} Qs
              </Typography>
            </View>
          </View>
        </View>

        {showChat && (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={m => m.id}
              contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.lg }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <View style={item.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAI}>
                  {item.role === 'assistant' && (
                    <VoiceOrb size="sm" orbState="idle" style={{ marginRight: spacing.sm, flexShrink: 0 }} />
                  )}
                  <View style={[styles.bubble, item.role === 'user' ? [styles.bubbleUser, { backgroundColor: colors.accent.primary }] : [styles.bubbleAI, { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border }]]}>
                    <Typography variant="body" style={{ color: item.role === 'user' ? colors.text.onDark : colors.text.primary, lineHeight: 22 }}>
                      {item.content}
                    </Typography>
                  </View>
                </View>
              )}
              ListFooterComponent={
                isChatLoading ? (
                  <View style={styles.bubbleRowAI}>
                    <VoiceOrb size="sm" orbState="thinking" style={{ marginRight: spacing.sm, flexShrink: 0 }} />
                    <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: colors.glass.transparent, borderColor: colors.glass.border }]}>
                      <ActivityIndicator size="small" color={colors.accent.primary} />
                    </View>
                  </View>
                ) : null
              }
            />

            {chatPhase === 'generating' && (
              <View style={[styles.generatingBar, { backgroundColor: colors.glass.opaque, borderTopColor: colors.glass.border }]}>
                <View style={[styles.generatingProgress, { backgroundColor: colors.accent.primary }]} />
                <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
                  Creating…
                </Typography>
              </View>
            )}

            {chatPhase === 'chatting' && (
              <View>
                <View style={[styles.costBadge, { backgroundColor: colors.glass.opaque, borderTopColor: colors.glass.border }]}>
                  <Typography variant="caption" style={{ color: colors.accent.secondary, fontSize: 11 }}>
                    1Q per AI reply · GPT-4o-mini
                  </Typography>
                </View>
                {chatCostError && (
                  <View style={[styles.costErrorRow, { backgroundColor: withOpacity(colors.error, 0.09), borderColor: withOpacity(colors.error, 0.25) }]}>
                    <Typography variant="caption" style={{ color: colors.error, fontSize: 12 }}>
                      {chatCostError}
                    </Typography>
                  </View>
                )}
                <View style={[styles.inputRow, { borderTopColor: colors.glass.border, backgroundColor: colors.glass.opaque }]}>
                  <TextInput
                    value={chatInput}
                    onChangeText={setChatInput}
                    placeholder="Type your message…"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="send"
                    onSubmitEditing={() => void handleSendChat()}
                    editable={!isChatLoading}
                    style={[styles.chatInput, { color: colors.text.primary }]}
                  />
                  <TouchableOpacity
                    onPress={() => void handleSendChat()}
                    disabled={!chatInput.trim() || isChatLoading}
                    activeOpacity={0.8}
                    style={[styles.sendBtn, { backgroundColor: chatInput.trim() && !isChatLoading ? colors.accent.primary : colors.glass.border }]}
                  >
                    <Typography variant="captionBold" style={{ color: colors.text.onDark, fontSize: 16 }}>↑</Typography>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        {chatPhase === 'done' && generatedScript && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.successBanner, { backgroundColor: `${colors.success}20`, borderColor: `${colors.success}40` }]}>
              <Typography variant="captionBold" style={{ color: colors.success }}>
                ✓ Your {TYPE_LABELS[contentType]} script is ready
              </Typography>
            </View>

            <Card variant="default" style={{ padding: spacing.lg, borderColor: colors.glass.border, borderWidth: 1, marginBottom: spacing.xl }}>
              <Typography variant="body" style={{ color: colors.text.primary, lineHeight: 24 }}>
                {generatedScript}
              </Typography>
            </Card>

            {continueError && (
              <View style={[styles.costErrorRow, { backgroundColor: withOpacity(colors.error, 0.09), borderColor: withOpacity(colors.error, 0.25) }]}>
                <Typography variant="caption" style={{ color: colors.error, fontSize: 12 }}>
                  {continueError}
                </Typography>
              </View>
            )}

            <View style={{ gap: spacing.md }}>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onPress={handleStartOver}
                disabled={isContinuing}
              >
                Start Over
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => void handleContinue()}
                disabled={isContinuing}
              >
                {isContinuing ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <ActivityIndicator size="small" color={colors.text.onDark} />
                    <Typography variant="body" style={{ color: colors.text.onDark }}>Saving…</Typography>
                  </View>
                ) : (
                  'Continue'
                )}
              </Button>
            </View>
          </ScrollView>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  bubbleRowUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bubbleRowAI: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  bubbleUser: {
    borderBottomRightRadius: borderRadius.sm,
  },
  bubbleAI: {
    borderWidth: 1,
    borderBottomLeftRadius: borderRadius.sm,
  },
  generatingBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    alignItems: 'flex-start',
  },
  generatingProgress: {
    height: 2,
    width: '40%',
    borderRadius: 1,
    marginBottom: spacing.xs,
  },
  navTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  chatInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBanner: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  costBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  costErrorRow: {
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
});
