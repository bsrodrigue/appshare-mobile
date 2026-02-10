import { z } from "zod";
import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/types/errors";
import {
  TokenResponseSchema,
  UserResponseSchema,
  ApiResponseSchema,
  EmptyDataSchema,
} from "@/types/api";
import { UserResourceSchema } from "@/types/auth";

// ============================================================================
// Login
// ============================================================================

export const LoginParamsSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = ApiResponseSchema(
  z.object({
    user: UserResourceSchema,
    tokens: TokenResponseSchema,
  }),
);

export type LoginParams = z.infer<typeof LoginParamsSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Authenticate with email/username and password.
 * Returns user data and access/refresh tokens.
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  // Validate input
  const validatedInput = LoginParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    email: validatedInput.data.email,
    password: validatedInput.data.password,
  };

  const response = await apiClient.post("auth/login", payload);

  // Validate output
  const validatedOutput = LoginResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Register
// ============================================================================

export const RegisterParamsSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const RegisterResponseSchema = ApiResponseSchema(
  z.object({
    user: UserResourceSchema,
    tokens: TokenResponseSchema,
  }),
);

export type RegisterParams = z.infer<typeof RegisterParamsSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

/**
 * Create a new user account.
 * Returns user data and access/refresh tokens.
 */
export async function register(
  params: RegisterParams,
): Promise<RegisterResponse> {
  // Validate input
  const validatedInput = RegisterParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    email: validatedInput.data.email,
    username: validatedInput.data.username,
    phone_number: validatedInput.data.phone_number,
    password: validatedInput.data.password,
    first_name: validatedInput.data.first_name,
    last_name: validatedInput.data.last_name,
  };

  const response = await apiClient.post("auth/register", payload);

  // Validate output
  const validatedOutput = RegisterResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Refresh Token
// ============================================================================

export const RefreshTokenParamsSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
});

export const RefreshTokenResponseSchema = ApiResponseSchema(
  z.object({
    tokens: TokenResponseSchema,
  }),
);

export type RefreshTokenParams = z.infer<typeof RefreshTokenParamsSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

/**
 * Exchange a valid refresh token for new access and refresh tokens.
 * Note: Uses a fresh axios instance to avoid circular token refresh.
 */
export async function refreshToken(
  params: RefreshTokenParams,
): Promise<RefreshTokenResponse> {
  // Validate input
  const validatedInput = RefreshTokenParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    refresh_token: validatedInput.data.refresh_token,
  };

  const response = await apiClient.post("auth/refresh", payload);

  // Validate output
  const validatedOutput = RefreshTokenResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Get Current User (Me)
// ============================================================================

export const MeResponseSchema = ApiResponseSchema(UserResponseSchema);

export type MeResponse = z.infer<typeof MeResponseSchema>;

/**
 * Get the currently authenticated user's profile.
 */
export async function me(): Promise<MeResponse> {
  const apiClient = APIService.getClient();

  const response = await apiClient.get("auth/me");

  // Validate output
  const validatedOutput = MeResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Change Password
// ============================================================================

export const ChangePasswordParamsSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
});

export const ChangePasswordResponseSchema = ApiResponseSchema(EmptyDataSchema);

export type ChangePasswordParams = z.infer<typeof ChangePasswordParamsSchema>;
export type ChangePasswordResponse = z.infer<
  typeof ChangePasswordResponseSchema
>;

/**
 * Change the current user's password.
 */
export async function changePassword(
  params: ChangePasswordParams,
): Promise<ChangePasswordResponse> {
  // Validate input
  const validatedInput = ChangePasswordParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    current_password: validatedInput.data.current_password,
    new_password: validatedInput.data.new_password,
  };

  const response = await apiClient.post("auth/change-password", payload);

  // Validate output
  const validatedOutput = ChangePasswordResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}
