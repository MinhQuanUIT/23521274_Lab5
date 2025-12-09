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
      theme: 'light',
      notifications: true,
      settings: defaultSettings,

      toggleTheme: () => {
        set(state => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          return {
            theme: newTheme,
            settings: { ...state.settings, theme: newTheme }
          };
        });
      },

      toggleNotifications: () => {
        set(state => {
          const newNotifications = !state.notifications;
          return {
            notifications: newNotifications,
            settings: { ...state.settings, notifications: newNotifications }
          };
        });
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings },
          theme: newSettings.theme || state.theme,
          notifications: newSettings.notifications !== undefined ? newSettings.notifications : state.notifications
        }));
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
