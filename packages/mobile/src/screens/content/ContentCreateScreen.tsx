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
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, Progress } from '@/components';
import { VoiceOrb } from '@/components/audio';
import { AI_MODE_COSTS } from '@waqup/shared/constants';
import {
  sendConversationMessage,
  generateScript,
  generateAgentScript,
  renderContentAudio,
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

const MODE_LABELS: Record<string, string> = {
  form: 'Quick Form',
  chat: 'Guided Chat',
  agent: 'AI Agent',
};

const TYPE_ICONS: Record<string, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

const OPENING_PROMPT: Record<string, string> = {
  affirmation: 'What area of your life do you want to strengthen?',
  meditation: 'What state are you looking to access — sleep, calm, focus?',
  ritual: 'What transformation are you working toward?',
};

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FORM_FIELDS: Record<string, FormField[]> = {
  affirmation: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Morning Confidence Boost' },
    { key: 'goal', label: 'Goal / Belief to shift', placeholder: 'What belief or pattern do you want to change?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 5' },
    { key: 'frequency', label: 'Frequency', placeholder: 'E.g. Daily, 3x per week' },
  ],
  meditation: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Deep Ocean Calm' },
    { key: 'intention', label: 'Intention', placeholder: 'What state do you want to reach?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 20' },
    { key: 'setting', label: 'Setting / Theme', placeholder: 'E.g. Beach, forest, cosmic void' },
  ],
  ritual: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Morning Power Ritual' },
    { key: 'identity', label: 'Identity to embody', placeholder: 'Who do you become through this ritual?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 30' },
    { key: 'elements', label: 'Key elements', placeholder: 'Breathwork, visualisation, affirmations, etc.' },
    { key: 'frequency', label: 'Frequency', placeholder: 'E.g. Every morning' },
  ],
};

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ContentCreateScreen({ navigation, route }: Props) {
  const { contentType, mode } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;

  // ── Form mode state ──────────────────────────────────────────────────────
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Chat mode state ──────────────────────────────────────────────────────
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatPhase, setChatPhase] = useState<'chatting' | 'generating' | 'done'>('chatting');
  const [generatedScript, setGeneratedScript] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // ── Agent mode state ─────────────────────────────────────────────────────
  const [agentIntent, setAgentIntent] = useState('');
  const [agentContext, setAgentContext] = useState('');
  const [isAgentGenerating, setIsAgentGenerating] = useState(false);
  const [showAgentConfirm, setShowAgentConfirm] = useState(false);
  const [chatCostError, setChatCostError] = useState<string | null>(null);

  // ── TTS rendering state ──────────────────────────────────────────────────
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const { mutateAsync: createContent } = useCreateContent();

  const fields = FORM_FIELDS[contentType] ?? [];
  const filledCount = fields.filter((f) => (formValues[f.key] ?? '').trim().length > 0).length;
  const progress = fields.length > 0 ? filledCount / fields.length : 0;
  const canSubmit = filledCount >= Math.ceil(fields.length * 0.5);

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Initialise chat with opening prompt
  useEffect(() => {
    if (mode === 'chat' && messages.length === 0) {
      setMessages([{
        id: 'opening',
        role: 'assistant',
        content: OPENING_PROMPT[contentType] ?? 'What would you like to create?',
      }]);
    }
  }, [mode, contentType, messages.length]);

  const doGenerateScript = useCallback(async (chatHistory: DisplayMessage[]) => {
    setChatPhase('generating');
    const firstUserMsg = chatHistory.find(m => m.role === 'user');
    const allUserContent = chatHistory.filter(m => m.role === 'user').map(m => m.content).join(' ');
    try {
      const res = await generateScript(contentType, firstUserMsg?.content ?? allUserContent, allUserContent);
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

      const res = await sendConversationMessage(contentType, apiMessages);

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

  const handleAgentGenerate = async () => {
    if (!agentIntent.trim() || isAgentGenerating) return;
    setShowAgentConfirm(false);
    setIsAgentGenerating(true);
    try {
      const res = await generateAgentScript(contentType, agentIntent, { context: agentContext || undefined });
      if ('error' in res && res.error === 'insufficient_credits') {
        setChatCostError((res as { message?: string }).message ?? `AI Agent costs ${AI_MODE_COSTS.agent} Qs but your balance is too low.`);
        return;
      }
      if ('error' in res && res.error === 'Unauthorized') {
        setChatCostError('Please sign in to use AI Agent.');
        return;
      }
      setGeneratedScript(res.script);
      setChatPhase('done');
    } catch {
      setChatCostError('Something went wrong. Please try again.');
    } finally {
      setIsAgentGenerating(false);
    }
  };

  /**
   * Creates a content item from the generated script, then calls the render
   * API to generate audio via ElevenLabs and navigate to ContentDetail.
   */
  const handleRenderAudio = async () => {
    if (isRendering || !generatedScript) return;
    setIsRendering(true);
    setRenderError(null);

    try {
      // 1. Create the content item in draft state
      const item = await createContent({
        type: contentType,
        title: `My ${contentType}`,
        description: '',
        script: generatedScript,
        status: 'draft',
      });

      // 2. Fetch the user's ElevenLabs voice ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('elevenlabs_voice_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .single();

      const voiceId = (profile as { elevenlabs_voice_id?: string } | null)?.elevenlabs_voice_id;

      if (!voiceId) {
        // No voice cloned yet — navigate to ContentDetail without audio
        // User can set up their voice in Voice Settings
        navigation.navigate('ContentDetail', { contentId: item.id, contentType });
        Alert.alert(
          'No Voice Set Up',
          'Your content has been saved. Set up your voice in Profile → Voice Settings to generate audio.',
          [{ text: 'OK' }]
        );
        return;
      }

      // 3. Render audio via ElevenLabs
      const result = await renderContentAudio(item.id, generatedScript, voiceId);

      if ('error' in result && result.error === 'insufficient_credits') {
        setRenderError(result.message ?? 'Not enough Qs to render audio.');
        // Still navigate to ContentDetail — audio can be rendered later
        navigation.navigate('ContentDetail', { contentId: item.id, contentType });
        return;
      }

      // 4. Navigate to ContentDetail — audio URL is now saved server-side
      navigation.navigate('ContentDetail', { contentId: item.id, contentType });
    } catch {
      setRenderError('Could not generate audio. Please try again.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleFormSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const item = await createContent({
        type: contentType,
        title: formValues.title ?? `My ${contentType}`,
        description: formValues.goal ?? formValues.intention ?? formValues.identity ?? '',
        duration: formValues.duration ?? undefined,
        frequency: formValues.frequency ?? undefined,
        status: 'draft',
      });
      navigation.navigate('ContentDetail', { contentId: item.id, contentType });
    } catch {
      // Toast would go here — for now fail silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const creditCost = mode === 'chat' ? AI_MODE_COSTS.chat : mode === 'agent' ? AI_MODE_COSTS.agent : 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen scrollable={false} padding={false}>
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <View style={styles.navTitle}>
            {mode === 'chat' && <VoiceOrb size="sm" orbState={isChatLoading || chatPhase === 'generating' ? 'thinking' : 'idle'} style={{ marginRight: spacing.sm }} />}
            <View style={{ alignItems: 'center' }}>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>
                Creating Your {TYPE_LABELS[contentType]}
              </Typography>
              {creditCost > 0 && (
                <Typography variant="caption" style={{ color: colors.accent.secondary, fontSize: 11 }}>
                  {creditCost} Qs
                </Typography>
              )}
            </View>
          </View>
        </View>

        {mode === 'form' && (
          <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
            <Progress value={progress * 100} color="primary" />
          </View>
        )}

        {/* ── FORM MODE ─────────────────────────────────────────────────── */}
        {mode === 'form' && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Typography variant="h2" style={{ fontSize: 32 }}>{TYPE_ICONS[contentType]}</Typography>
              <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.sm }}>
                New {TYPE_LABELS[contentType]}
              </Typography>
            </View>
            <View style={styles.form}>
              {fields.map((field) => (
                <View key={field.key} style={styles.fieldGroup}>
                  <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                    {field.label}
                  </Typography>
                  <TextInput
                    value={formValues[field.key] ?? ''}
                    onChangeText={(v) => handleFieldChange(field.key, v)}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.text.secondary}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 4 : 1}
                    style={[
                      styles.textInput,
                      field.multiline && styles.textInputMulti,
                      { color: colors.text.primary, backgroundColor: colors.glass.opaque, borderColor: formValues[field.key] ? colors.accent.primary : colors.glass.border },
                    ]}
                  />
                </View>
              ))}
              <Button variant="primary" size="lg" fullWidth onPress={handleFormSubmit} disabled={!canSubmit || isSubmitting} style={{ marginTop: spacing.xl }}>
                {isSubmitting ? 'Creating...' : 'Create Practice'}
              </Button>
            </View>
          </ScrollView>
        )}

        {/* ── CHAT MODE ─────────────────────────────────────────────────── */}
        {mode === 'chat' && chatPhase !== 'done' && (
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
                  <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                    <Typography variant="body" style={{ color: item.role === 'user' ? '#fff' : colors.text.primary, lineHeight: 22 }}>
                      {item.content}
                    </Typography>
                  </View>
                </View>
              )}
              ListFooterComponent={
                <>
                  {isChatLoading && (
                    <View style={styles.bubbleRowAI}>
                      <VoiceOrb size="sm" orbState="thinking" style={{ marginRight: spacing.sm, flexShrink: 0 }} />
                      <View style={[styles.bubble, styles.bubbleAI]}>
                        <ActivityIndicator size="small" color={colors.accent.primary} />
                      </View>
                    </View>
                  )}
                </>
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
                {/* Per-reply cost badge */}
                <View style={[styles.costBadge, { backgroundColor: colors.glass.opaque, borderTopColor: colors.glass.border }]}>
                  <Typography variant="caption" style={{ color: colors.accent.secondary, fontSize: 11 }}>
                    1Q per AI reply · GPT-4o-mini
                  </Typography>
                </View>
                {/* Cost / auth error */}
                {chatCostError && (
                  <View style={[styles.costErrorRow, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
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
                    <Typography variant="captionBold" style={{ color: '#fff', fontSize: 16 }}>↑</Typography>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        {/* ── AGENT MODE ────────────────────────────────────────────────── */}
        {mode === 'agent' && chatPhase !== 'done' && (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Typography variant="h2" style={{ fontSize: 32 }}>🤖</Typography>
              <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.sm }}>
                AI Agent
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
                Describe your intent and the AI will autonomously craft a complete {contentType} script using GPT-4o.
              </Typography>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                  What do you want to achieve? *
                </Typography>
                <TextInput
                  value={agentIntent}
                  onChangeText={setAgentIntent}
                  placeholder={`E.g. Build unshakeable confidence in my ${contentType === 'affirmation' ? 'creative work' : contentType === 'meditation' ? 'morning routine' : 'daily practice'}`}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={4}
                  style={[styles.textInput, styles.textInputMulti, { color: colors.text.primary, backgroundColor: colors.glass.opaque, borderColor: agentIntent ? colors.accent.primary : colors.glass.border }]}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                  Additional context (optional)
                </Typography>
                <TextInput
                  value={agentContext}
                  onChangeText={setAgentContext}
                  placeholder="Your name, core values, current challenges, anything that matters…"
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={3}
                  style={[styles.textInput, styles.textInputMulti, { height: 80, color: colors.text.primary, backgroundColor: colors.glass.opaque, borderColor: agentContext ? colors.accent.primary : colors.glass.border }]}
                />
              </View>

              <Card variant="default" style={{ padding: spacing.md, borderColor: colors.glass.border, borderWidth: 1 }}>
                <Typography variant="caption" style={{ color: colors.text.secondary }}>
                  🤖 GPT-4o will autonomously generate a complete, personalized {contentType} script in one pass. Costs {AI_MODE_COSTS.agent} Qs.
                </Typography>
              </Card>

              {chatCostError && (
                <View style={[styles.costErrorRow, { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` }]}>
                  <Typography variant="caption" style={{ color: colors.error, fontSize: 12 }}>
                    {chatCostError}
                  </Typography>
                </View>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => { setChatCostError(null); setShowAgentConfirm(true); }}
                disabled={!agentIntent.trim() || isAgentGenerating}
                style={{ marginTop: spacing.xl }}
              >
                {isAgentGenerating ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Typography variant="body" style={{ color: '#fff' }}>Generating…</Typography>
                  </View>
                ) : (
                  `Generate with AI · ${AI_MODE_COSTS.agent} Qs`
                )}
              </Button>
            </View>
          </ScrollView>
        )}

        {/* ── SCRIPT RESULT (chat + agent) ──────────────────────────────── */}
        {chatPhase === 'done' && generatedScript && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
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

            {renderError && (
              <View style={[styles.costErrorRow, { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }]}>
                <Typography variant="caption" style={{ color: '#ef4444', fontSize: 12 }}>
                  {renderError}
                </Typography>
              </View>
            )}

            <View style={{ gap: spacing.md }}>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onPress={() => {
                  setChatPhase('chatting');
                  setGeneratedScript('');
                  setMessages([]);
                  setAgentIntent('');
                  setAgentContext('');
                  setRenderError(null);
                }}
                disabled={isRendering}
              >
                Start Over
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => void handleRenderAudio()}
                disabled={isRendering}
              >
                {isRendering ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Typography variant="body" style={{ color: '#fff' }}>Generating Audio…</Typography>
                  </View>
                ) : (
                  '✨ Generate Audio & Save'
                )}
              </Button>
            </View>
          </ScrollView>
        )}
        {/* ── Agent cost confirmation modal ─────────────────────────────── */}
        <Modal
          visible={showAgentConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAgentConfirm(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowAgentConfirm(false)}
          >
            <Pressable
              style={[styles.modalCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
              onPress={() => {}}
            >
              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                🤖 AI Agent (GPT-4o)
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 22 }}>
                This will use{' '}
                <Typography variant="body" style={{ color: colors.accent.secondary, fontWeight: '700' }}>
                  {AI_MODE_COSTS.agent} Qs
                </Typography>{' '}
                from your balance to generate a complete{' '}
                {TYPE_LABELS[contentType].toLowerCase()} script using GPT-4o.
              </Typography>
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <Button
                  variant="outline"
                  size="md"
                  style={{ flex: 1 }}
                  onPress={() => setShowAgentConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  style={{ flex: 1 }}
                  onPress={() => void handleAgentGenerate()}
                >
                  Use {AI_MODE_COSTS.agent} Qs
                </Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
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
  header: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    height: 48,
  },
  textInputMulti: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
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
    backgroundColor: '#9333EA',
    borderBottomRightRadius: borderRadius.sm,
  },
  bubbleAI: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
});
