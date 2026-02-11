import { create } from "zustand";
import { UserResponse } from "@/types/api";
import { TokenService } from "@/libs/token";
import { Logger } from "@/libs/log";

const logger = new Logger("AuthStore");

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isVerifyingAuth: boolean;
}

interface AuthActions {
  setUser: (user: UserResponse) => void;
  /**
   * Clears user state and stored tokens.
   */
  logout: () => void;
  setIsVerifyingAuth: (isVerifyingAuth: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isVerifyingAuth: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    logger.debug("Logging out user...");
    // Clear tokens in background
    TokenService.clearTokens().catch((err) =>
      logger.error("Failed to clear tokens on logout", err),
    );
    set({ user: null, isAuthenticated: false });
  },
  setIsVerifyingAuth: (isVerifyingAuth) => set({ isVerifyingAuth }),
}));
