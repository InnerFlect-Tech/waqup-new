/**
 * Test file to verify all dependencies are installed correctly
 * This file can be imported in page.tsx temporarily to verify imports work
 */

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Utilities
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// State management from shared
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';

// Shared package imports (will be available once shared types are created)
// import type { User } from '@waqup/shared/types';

// Test that all imports work
export const testImports = {
  forms: true,
  utils: true,
  state: true,
  // shared: true, // Will test once shared types are created
};
