import { create } from 'zustand';
import { UserResource } from '@/types/auth';

interface AuthState {
    user: UserResource | null;
    isAuthenticated: boolean;
    isVerifyingAuth: boolean;
}

interface AuthActions {
    setUser: (user: UserResource) => void;
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
    logout: () => set({ user: null, isAuthenticated: false }),
    setIsVerifyingAuth: (isVerifyingAuth: boolean) => set({ isVerifyingAuth }),
}));