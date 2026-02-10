import { z } from "zod";
import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/types/errors";
import {
  UserResponseSchema,
  ApiResponseSchema,
  EmptyDataSchema,
} from "@/types/api";

// ============================================================================
// List Users
// ============================================================================

export const ListUsersResponseSchema = ApiResponseSchema(
  z.array(UserResponseSchema).nullable(),
);

export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

/**
 * Retrieve a list of all active users.
 */
export async function listUsers(): Promise<ListUsersResponse> {
  const apiClient = APIService.getClient();

  const response = await apiClient.get("users");

  // Validate output
  const validatedOutput = ListUsersResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Get User
// ============================================================================

export const GetUserParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export const GetUserResponseSchema = ApiResponseSchema(UserResponseSchema);

export type GetUserParams = z.infer<typeof GetUserParamsSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

/**
 * Retrieve a specific user by ID.
 */
export async function getUser(params: GetUserParams): Promise<GetUserResponse> {
  // Validate input
  const validatedInput = GetUserParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const response = await apiClient.get(`users/${validatedInput.data.id}`);

  // Validate output
  const validatedOutput = GetUserResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Create User
// ============================================================================

export const CreateUserParamsSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(1, "Username is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const CreateUserResponseSchema = ApiResponseSchema(UserResponseSchema);

export type CreateUserParams = z.infer<typeof CreateUserParamsSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

/**
 * Create a new user account.
 */
export async function createUser(
  params: CreateUserParams,
): Promise<CreateUserResponse> {
  // Validate input
  const validatedInput = CreateUserParamsSchema.safeParse(params);
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

  const response = await apiClient.post("users", payload);

  // Validate output
  const validatedOutput = CreateUserResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Update User Profile
// ============================================================================

export const UpdateProfileParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const UpdateProfileResponseSchema =
  ApiResponseSchema(UserResponseSchema);

export type UpdateProfileParams = z.infer<typeof UpdateProfileParamsSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

/**
 * Update a user's profile (first name, last name).
 */
export async function updateProfile(
  params: UpdateProfileParams,
): Promise<UpdateProfileResponse> {
  // Validate input
  const validatedInput = UpdateProfileParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    first_name: validatedInput.data.first_name,
    last_name: validatedInput.data.last_name,
  };

  const response = await apiClient.patch(
    `users/${validatedInput.data.id}/profile`,
    payload,
  );

  // Validate output
  const validatedOutput = UpdateProfileResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Delete User
// ============================================================================

export const DeleteUserParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export const DeleteUserResponseSchema = ApiResponseSchema(EmptyDataSchema);

export type DeleteUserParams = z.infer<typeof DeleteUserParamsSchema>;
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;

/**
 * Soft delete a user account.
 */
export async function deleteUser(
  params: DeleteUserParams,
): Promise<DeleteUserResponse> {
  // Validate input
  const validatedInput = DeleteUserParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const response = await apiClient.delete(`users/${validatedInput.data.id}`);

  // Validate output
  const validatedOutput = DeleteUserResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}
