import { z } from "zod";
import {
  TokenResponseSchema,
  UserResponseSchema,
  ApiResponseSchema,
} from "../shared/types";

// ============================================================================
// Login
// ============================================================================

export const LoginParamsSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
  tokens: TokenResponseSchema,
  user: UserResponseSchema,
});

export type LoginParams = z.infer<typeof LoginParamsSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// ============================================================================
// Register
// ============================================================================

export const RegisterParamsSchema = z.object({
  email: z.email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const RegisterResponseSchema = z.object({
  tokens: TokenResponseSchema,
  user: UserResponseSchema,
});

export type RegisterParams = z.infer<typeof RegisterParamsSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// ============================================================================
// Refresh Token
// ============================================================================

export const RefreshTokenParamsSchema = z.object({
  refresh_token: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  tokens: TokenResponseSchema,
});

export type RefreshTokenParams = z.infer<typeof RefreshTokenParamsSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// ============================================================================
// OTP & Verification
// ============================================================================

export const VerifyOTPParamsSchema = z.object({
  phone: z.string(),
  code: z.string().length(6, "Code must be 6 digits"),
});

export const ResendOTPParamsSchema = z.object({
  phone: z.string(),
});

export const ResendOTPResponseSchema = z.object({
  attempts_remaining: z.number(),
  expires_at: z.string().datetime(),
});

export type VerifyOTPParams = z.infer<typeof VerifyOTPParamsSchema>;
export type ResendOTPParams = z.infer<typeof ResendOTPParamsSchema>;
export type ResendOTPResponse = z.infer<typeof ResendOTPResponseSchema>;

// ============================================================================
// API Response Wrappers
// ============================================================================

export const AuthApiResponseSchema = ApiResponseSchema(LoginResponseSchema);
export const RefreshApiResponseSchema = ApiResponseSchema(
  RefreshTokenResponseSchema,
);
export const MeApiResponseSchema = ApiResponseSchema(UserResponseSchema);
export const VerifyOTPApiResponseSchema =
  ApiResponseSchema(LoginResponseSchema);
export const ResendOTPApiResponseSchema = ApiResponseSchema(
  ResendOTPResponseSchema,
);

// ============================================================================
// Change Password
// ============================================================================

export const ChangePasswordParamsSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

export type ChangePasswordParams = z.infer<typeof ChangePasswordParamsSchema>;

// ============================================================================
// Legacy Form Types (Kept for UI compatibility during migration)
// ============================================================================

export interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  terms?: string;
  document?: string;
  logo?: string;
  role?: string;
}

export type AuthMode = "login" | "register";
