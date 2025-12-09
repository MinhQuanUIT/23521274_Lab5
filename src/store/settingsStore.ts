import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState, AppSettings } from '../types';

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  notifications: true
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
