import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import { ApiResponseSchema, EmptyDataSchema } from "@/modules/shared/types";
import type { UserResponse, EmptyData } from "@/modules/shared/types";
import {
  LoginParams,
  LoginParamsSchema,
  LoginResponse,
  AuthApiResponseSchema,
  RegisterParams,
  RegisterParamsSchema,
  RegisterResponse,
  RefreshTokenParams,
  RefreshTokenParamsSchema,
  RefreshTokenResponse,
  RefreshApiResponseSchema,
  VerifyOTPParams,
  VerifyOTPParamsSchema,
  ResendOTPParams,
  ResendOTPParamsSchema,
  ResendOTPResponse,
  ResendOTPApiResponseSchema,
  MeApiResponseSchema,
  VerifyOTPApiResponseSchema,
  ChangePasswordParams,
  ChangePasswordParamsSchema,
} from "./types";

export type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
  VerifyOTPParams,
  ResendOTPParams,
  ResendOTPResponse,
  UserResponse,
  EmptyData,
  ChangePasswordParams,
};

// ============================================================================
// Auth API Endpoints
// ============================================================================

export async function login(params: LoginParams): Promise<LoginResponse> {
  const validatedInput = LoginParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<LoginResponse>(
    "auth/login",
    validatedInput.data,
  );

  const validatedOutput = AuthApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function register(
  params: RegisterParams,
): Promise<RegisterResponse> {
  const validatedInput = RegisterParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<RegisterResponse>(
    "auth/register",
    validatedInput.data,
  );

  const validatedOutput = AuthApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function refreshToken(
  params: RefreshTokenParams,
): Promise<RefreshTokenResponse> {
  const validatedInput = RefreshTokenParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<RefreshTokenResponse>(
    "auth/refresh",
    validatedInput.data,
  );

  const validatedOutput = RefreshApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function me(): Promise<UserResponse> {
  const apiClient = APIService.getClient();
  const response = await apiClient.get<UserResponse>("auth/me");

  const validatedOutput = MeApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

// ============================================================================
// OTP & Verification
// ============================================================================

export async function verifyOTP(
  params: VerifyOTPParams,
): Promise<LoginResponse> {
  const validatedInput = VerifyOTPParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<LoginResponse>(
    "auth/verify-otp",
    validatedInput.data,
  );

  const validatedOutput = VerifyOTPApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function resendOTP(
  params: ResendOTPParams,
): Promise<ResendOTPResponse> {
  const validatedInput = ResendOTPParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<ResendOTPResponse>(
    "auth/resend-otp",
    validatedInput.data,
  );

  const validatedOutput = ResendOTPApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

// ============================================================================
// Change Password
// ============================================================================

export async function changePassword(
  params: ChangePasswordParams,
): Promise<EmptyData> {
  const validatedInput = ChangePasswordParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<EmptyData>(
    "auth/change-password",
    validatedInput.data,
  );

  const validatedOutput =
    ApiResponseSchema(EmptyDataSchema).safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}
