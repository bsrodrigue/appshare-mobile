import { create } from "zustand";
import { UserResource } from "@/types/auth";
import { TokenService } from "@/libs/token";
import { Logger } from "@/libs/log";

const logger = new Logger("AuthStore");

interface AuthState {
  user: UserResource | null;
  isAuthenticated: boolean;
  isVerifyingAuth: boolean;
}

interface AuthActions {
  setUser: (user: UserResource) => void;
  logout: () => Promise<void>;
  setIsVerifyingAuth: (isVerifyingAuth: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isVerifyingAuth: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      // Clear all tokens
      await TokenService.clearTokens();
      logger.debug("Logged out, tokens cleared");
    } catch (error) {
      logger.error(`Failed to clear tokens during logout - ${error}`);
    }
    set({ user: null, isAuthenticated: false });
  },

  setIsVerifyingAuth: (isVerifyingAuth: boolean) => set({ isVerifyingAuth }),
}));
