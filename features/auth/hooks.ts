import {
  RegisterParams,
  RegisterResponse,
  register,
  LoginParams,
  LoginResponse,
  MeResponse,
  ResendOTPParams,
  ResendOTPResponse,
  VerifyPhoneParams,
  VerifyPhoneResponse,
  login,
  me,
  resendOTP,
  verifyPhone,
} from "@/features/auth/api";
import { useCall } from "@/hooks/api";

// Login
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

// Register
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

// Resend
export interface UseResendParams {
  onSuccess: (response: ResendOTPResponse) => void;
  onError: (error: string) => void;
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

// Verify
export interface UseVerifyParams {
  onSuccess: (response: VerifyPhoneResponse) => void;
  onError: (error: string) => void;
}

export function useVerify({ onSuccess, onError }: UseVerifyParams) {
  const { execute, loading } = useCall<VerifyPhoneResponse, VerifyPhoneParams>({
    fn: verifyPhone,
    onSuccess,
    onError,
  });

  return {
    callVerify: execute,
    isLoading: loading,
  };
}

// Me
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
