import React, { useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { spacing, borderRadius, shadows } from '@/theme';
import { BlurView } from 'expo-blur';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string; // Number (pixels) or string ('50%', etc.)
  showHandle?: boolean;
  style?: ViewStyle;
}

/**
 * BottomSheet Component - Modal bottom sheet for mobile
 * Provides smooth slide-up animation and backdrop blur
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  height = '80%',
  showHandle = true,
  style,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleHeight = typeof height === 'string' 
    ? (parseFloat(height) / 100) * SCREEN_HEIGHT 
    : height;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: handleHeight,
            backgroundColor: colors.glass.opaque,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            paddingBottom: insets.bottom,
            transform: [{ translateY: slideAnim }],
            ...shadows.xl,
            ...style,
          },
        ]}
      >
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            {showHandle && (
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: colors.glass.border,
                  },
                ]}
              />
            )}
            {children}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  content: {
    flex: 1,
    paddingTop: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});
