import { create } from 'zustand';
import type { NotificationState, Notification } from '../types';

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep last 50
    }));
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  }
}));
