import {
  RegisterParams,
  RegisterResponse,
  register,
  LoginParams,
  LoginResponse,
  MeResponse,
  ChangePasswordParams,
  ChangePasswordResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
  login,
  me,
  changePassword,
  refreshToken,
} from "@/modules/auth/api";
import { useCall } from "@/hooks/api";

// ============================================================================
// Login
// ============================================================================

export interface UseLoginParams {
  onSuccess: (response: LoginResponse) => void;
  onError: (error: string) => void;
}

export function useLogin({ onSuccess, onError }: UseLoginParams) {
  const { execute, loading } = useCall<LoginResponse, LoginParams>({
    fn: login,
    onSuccess,
    onError,
  });

  return {
    callLogin: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Register
// ============================================================================

export interface UseRegisterParams {
  onSuccess: (response: RegisterResponse) => void;
  onError: (error: string) => void;
}

export function useRegister({ onSuccess, onError }: UseRegisterParams) {
  const { execute, loading } = useCall<RegisterResponse, RegisterParams>({
    fn: register,
    onSuccess,
    onError,
  });

  return {
    callRegister: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Refresh Token
// ============================================================================

export interface UseRefreshTokenParams {
  onSuccess?: (response: RefreshTokenResponse) => void;
  onError?: (error: string) => void;
}

export function useRefreshToken({ onSuccess, onError }: UseRefreshTokenParams) {
  const { execute, loading } = useCall<
    RefreshTokenResponse,
    RefreshTokenParams
  >({
    fn: refreshToken,
    onSuccess,
    onError,
  });

  return {
    callRefreshToken: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Me (Get Current User)
// ============================================================================

export interface UseMeParams {
  onSuccess?: (response: MeResponse) => void;
  onError?: (error: string) => void;
}

export function useMe({ onSuccess, onError }: UseMeParams) {
  const { execute, loading } = useCall<MeResponse, void>({
    fn: me,
    onSuccess,
    onError,
  });

  return {
    callMe: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Change Password
// ============================================================================

export interface UseChangePasswordParams {
  onSuccess?: (response: ChangePasswordResponse) => void;
  onError?: (error: string) => void;
}

export function useChangePassword({
  onSuccess,
  onError,
}: UseChangePasswordParams) {
  const { execute, loading } = useCall<
    ChangePasswordResponse,
    ChangePasswordParams
  >({
    fn: changePassword,
    onSuccess,
    onError,
  });

  return {
    callChangePassword: execute,
    isLoading: loading,
  };
}
