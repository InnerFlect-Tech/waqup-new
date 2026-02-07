/**
 * Shadow/Elevation System - Subtle Depth
 * Glass surfaces with soft elevation
 */

import { Platform } from 'react-native';

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: Platform.OS === 'android' ? 8 : 0,
  },
};
