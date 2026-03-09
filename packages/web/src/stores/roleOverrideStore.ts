import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'waqup_view_as_role';

export type ViewAsRole = 'user' | 'creator' | 'admin' | null;

const sessionStorageAdapter = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};

interface RoleOverrideState {
  viewAsRole: ViewAsRole;
  setViewAsRole: (role: ViewAsRole) => void;
}

export const useRoleOverrideStore = create<RoleOverrideState>()(
  persist(
    (set) => ({
      viewAsRole: null,
      setViewAsRole: (role) => set({ viewAsRole: role }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorageAdapter),
    }
  )
);
