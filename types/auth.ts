import { z } from "zod";

// ============================================================================
// User Resource
// ============================================================================

/**
 * User resource as returned by the AppShare API.
 * Note: id is now a UUID string (previously was number).
 */
export const UserResourceSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  phone_number: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  last_login_at: z.string().optional(),
});

export type UserResource = z.infer<typeof UserResourceSchema>;

// ============================================================================
// Form Types (for UI components)
// ============================================================================

export interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  promoCode: string;
  documentUri?: string;
  logoUri?: string;
  role?: string;
}

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
