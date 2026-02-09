import { APIService } from "@/libs/api/client";
import { DateTimeService } from "@/libs/datetime";
import { UserResource } from "@/types/auth";
import { ApiInputError, ApiOutputError } from "@/types/errors";
import { z } from "zod";

// ============================================================================
// Zod Schemas - Login
// ============================================================================

export const LoginParamsSchema = z.object({
  login: z.string().min(1, "Login is required"), // email or phone number
  password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.custom<UserResource>(),
    token: z.string(),
    token_type: z.literal("Bearer"),
    expires_in: z.number(),
  }),
});

export type LoginParams = z.infer<typeof LoginParamsSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export async function login(params: LoginParams): Promise<LoginResponse> {
  // Validate input
  const validatedInput = LoginParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    login: validatedInput.data.login,
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
// Zod Schemas - Register
// ============================================================================

export const RegisterParamsSchema = z
  .object({
    // Personal Information (Common - Required)
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name must be 100 characters or less"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name must be 100 characters or less"),
    birthDate: z.date(),

    // Contact Information (Common - Required)
    email: z.string().email("Invalid email format"),
    phoneNumber: z.string().min(1, "Phone number is required"),

    // Application Information (Common - Required)
    role: z.enum(["client", "seller", "delivery_man"] as const),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),

    // Optional (Common)
    promoCode: z
      .string()
      .max(50, "Promo code must be 50 characters or less")
      .optional()
      .nullable(),

    // Seller-specific fields
    shopName: z
      .string()
      .max(255, "Shop name must be 255 characters or less")
      .optional()
      .nullable(),
    cnibRecto: z.any().optional().nullable(), // File | Blob | any (≤5120 chars when encoded)
    cnibVerso: z.any().optional().nullable(), // File | Blob | any (≤5120 chars when encoded)
    businessRegister: z.any().optional().nullable(), // File | Blob | any (≤10240 chars when encoded)

    // Delivery man-specific fields
    vehicle_type: z.enum(["moto", "velo", "voiture"]).optional().nullable(),
    license_plate: z
      .string()
      .max(20, "License plate must be 20 characters or less")
      .optional()
      .nullable(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.shopName && data.shopName.trim().length > 0;
      }
      return true;
    },
    {
      message: "Shop name is required for sellers",
      path: ["shopName"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.cnibRecto;
      }
      return true;
    },
    {
      message: "CNIB recto photo is required for sellers",
      path: ["cnibRecto"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "seller") {
        return !!data.cnibVerso;
      }
      return true;
    },
    {
      message: "CNIB verso photo is required for sellers",
      path: ["cnibVerso"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.vehicle_type;
      }
      return true;
    },
    {
      message: "Vehicle type is required for delivery personnel",
      path: ["vehicle_type"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.cnibRecto;
      }
      return true;
    },
    {
      message: "CNIB recto photo is required for delivery personnel",
      path: ["cnibRecto"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "delivery_man") {
        return !!data.cnibVerso;
      }
      return true;
    },
    {
      message: "CNIB verso photo is required for delivery personnel",
      path: ["cnibVerso"],
    }
  );

export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    phone: z.string(),
    expires_in: z.number(),
  }),
});

export type RegisterParams = z.infer<typeof RegisterParamsSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

export async function register(
  params: RegisterParams
): Promise<RegisterResponse> {
  // Validate input
  const validatedInput = RegisterParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  // Create FormData for multipart/form-data submission
  const formData = new FormData();

  // Required fields
  formData.append("first_name", validatedInput.data.firstName);
  formData.append("last_name", validatedInput.data.lastName);
  formData.append(
    "date_of_birth",
    DateTimeService.format(validatedInput.data.birthDate)
  );
  formData.append("email", validatedInput.data.email);
  formData.append("phone", validatedInput.data.phoneNumber);
  formData.append("role", validatedInput.data.role);
  formData.append("password", validatedInput.data.password);
  formData.append(
    "password_confirmation",
    validatedInput.data.passwordConfirmation
  );

  // Optional fields
  if (validatedInput.data.promoCode) {
    formData.append("promo_code", validatedInput.data.promoCode);
  }

  // Seller-specific fields
  if (validatedInput.data.role === "seller") {
    if (validatedInput.data.shopName) {
      formData.append("shop_name", validatedInput.data.shopName);
    }
    if (validatedInput.data.businessRegister) {
      formData.append(
        "business_register",
        validatedInput.data.businessRegister
      );
    }
  }

  // Delivery man-specific fields
  if (validatedInput.data.role === "delivery_man") {
    if (validatedInput.data.vehicle_type) {
      formData.append("vehicle_type", validatedInput.data.vehicle_type);
    }
    if (validatedInput.data.license_plate) {
      formData.append("license_plate", validatedInput.data.license_plate);
    }
  }

  // Both
  if (
    validatedInput.data.role === "delivery_man" ||
    validatedInput.data.role === "seller"
  ) {
    if (validatedInput.data.cnibRecto) {
      formData.append("cnib_recto", validatedInput.data.cnibRecto);
    }
    if (validatedInput.data.cnibVerso) {
      formData.append("cnib_verso", validatedInput.data.cnibVerso);
    }
  }

  const response = await apiClient.post("auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Validate output
  const validatedOutput = RegisterResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Zod Schemas - Verify Phone
// ============================================================================

export const VerifyPhoneParamsSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  code: z.string().min(1, "Verification code is required"),
});

export const VerifyPhoneResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.custom<UserResource>(),
    token: z.string(),
    token_type: z.literal("Bearer"),
    expires_in: z.number(),
  }),
});

export type VerifyPhoneParams = z.infer<typeof VerifyPhoneParamsSchema>;
export type VerifyPhoneResponse = z.infer<typeof VerifyPhoneResponseSchema>;

export async function verifyPhone(
  params: VerifyPhoneParams
): Promise<VerifyPhoneResponse> {
  // Validate input
  const validatedInput = VerifyPhoneParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    phone: validatedInput.data.phone,
    code: validatedInput.data.code,
  };

  const response = await apiClient.post("auth/verify-phone", payload);

  // Validate output
  const validatedOutput = VerifyPhoneResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Zod Schemas - Resend OTP
// ============================================================================

export const ResendOTPParamsSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});

export const ResendOTPResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    phone: z.string(),
    expires_in: z.number(),
    attempts_remaining: z.number(),
  }),
});

export type ResendOTPParams = z.infer<typeof ResendOTPParamsSchema>;
export type ResendOTPResponse = z.infer<typeof ResendOTPResponseSchema>;

export async function resendOTP(
  params: ResendOTPParams
): Promise<ResendOTPResponse> {
  // Validate input
  const validatedInput = ResendOTPParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    phone: validatedInput.data.phone,
  };

  const response = await apiClient.post("auth/resend-otp", payload);

  // Validate output
  const validatedOutput = ResendOTPResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Zod Schemas - Me
// ============================================================================

export const MeResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: z.custom<UserResource>(),
  }),
});

export type MeResponse = z.infer<typeof MeResponseSchema>;

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
