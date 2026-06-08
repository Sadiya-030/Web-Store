import { create } from "zustand";
import { User } from "@/lib/auth/client";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

/**
 * Zustand Auth Store
 * Synced with BetterAuth session state
 * Allows non-React contexts (like cartStore) to subscribe to auth changes
 */
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
