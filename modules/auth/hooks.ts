import {
  RegisterParams,
  RegisterResponse,
  register,
  LoginParams,
  LoginResponse,
  login,
  me,
  changePassword,
  ChangePasswordParams,
  verifyOTP,
  resendOTP,
  VerifyOTPParams,
  ResendOTPParams,
  ResendOTPResponse,
} from "@/modules/auth/api";
import { UserResponse } from "@/types/api";
import { useCall } from "@/hooks/api";

// ============================================================================
// Login
// ============================================================================

export interface UseLoginParams {
  onSuccess?: (response: LoginResponse) => void;
  onError?: (error: string) => void;
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
  onSuccess?: (response: RegisterResponse) => void;
  onError?: (error: string) => void;
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
// OTP & Verification
// ============================================================================

export interface UseVerifyParams {
  onSuccess?: (response: LoginResponse) => void;
  onError?: (error: string) => void;
}

export function useVerify({ onSuccess, onError }: UseVerifyParams) {
  const { execute, loading } = useCall<LoginResponse, VerifyOTPParams>({
    fn: verifyOTP,
    onSuccess,
    onError,
  });

  return {
    callVerify: execute,
    isLoading: loading,
  };
}

export interface UseResendParams {
  onSuccess?: (response: ResendOTPResponse) => void;
  onError?: (error: string) => void;
}

export function useResend({ onSuccess, onError }: UseResendParams) {
  const { execute, loading } = useCall<ResendOTPResponse, ResendOTPParams>({
    fn: resendOTP,
    onSuccess,
    onError,
  });

  return {
    callResend: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Me (Get Current User)
// ============================================================================

export interface UseMeParams {
  onSuccess?: (response: UserResponse) => void;
  onError?: (error: string) => void;
}

export function useMe({ onSuccess, onError }: UseMeParams) {
  const { execute, loading } = useCall<UserResponse, void>({
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
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useChangePassword({
  onSuccess,
  onError,
}: UseChangePasswordParams) {
  const { execute, loading } = useCall<any, ChangePasswordParams>({
    fn: changePassword,
    onSuccess,
    onError,
  });

  return {
    callChangePassword: execute,
    isLoading: loading,
  };
}
