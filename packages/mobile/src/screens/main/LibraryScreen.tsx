import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Library'>;

export default function LibraryScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Screen</Text>
      <Text style={styles.subtitle}>Placeholder - Will be implemented in Phase 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
