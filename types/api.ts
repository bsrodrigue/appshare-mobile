import { z } from "zod";

// ============================================================================
// Token Schemas
// ============================================================================

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  access_token_expires_at: z.string().datetime(),
  refresh_token_expires_at: z.string().datetime(),
  token_type: z.literal("Bearer"),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

// ============================================================================
// User Schemas
// ============================================================================

import { UserRoleSchema } from "./role";

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  phone_number: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: UserRoleSchema,
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  last_login_at: z.string().datetime().optional().nullable(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

// ============================================================================
// API Response Wrapper
// ============================================================================

/**
 * Base API response envelope following JSend-style structure.
 * All successful API responses are wrapped in this structure.
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    code: z.string().optional(),
    data: dataSchema,
  });

export type ApiResponse<T> = {
  status: number;
  message: string;
  code?: string;
  data: T;
};

// ============================================================================
// Error Schemas (RFC 7807)
// ============================================================================

export const ErrorDetailSchema = z.object({
  location: z.string().optional(),
  message: z.string().optional(),
  value: z.any().optional(),
});

export const ErrorModelSchema = z.object({
  type: z.string().optional().default("about:blank"),
  title: z.string().optional(),
  status: z.number().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  errors: z.array(ErrorDetailSchema).nullable().optional(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;
export type ErrorModel = z.infer<typeof ErrorModelSchema>;

// ============================================================================
// Empty Data Schema
// ============================================================================

export const EmptyDataSchema = z.object({}).strict();
export type EmptyData = z.infer<typeof EmptyDataSchema>;
