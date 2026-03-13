/**
 * Google "G" logo — matches web auth screens for design alignment.
 * Uses official Google brand asset.
 */
import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

export interface GoogleIconProps {
  size?: number;
  style?: ViewStyle;
}

export function GoogleIcon({ size = 20, style }: GoogleIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
