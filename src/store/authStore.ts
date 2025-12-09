import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

// Mock authentication service
const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'admin@nexsales.com' && password === 'admin123') {
    return {
      user: {
        id: '1',
        email: email,
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  }
  throw new Error('Invalid credentials');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { user, token } = await mockLogin(email, password);
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      updateUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
