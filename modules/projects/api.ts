import { z } from "zod";
import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/types/errors";
import { ApiResponseSchema, EmptyDataSchema } from "@/types/api";

// ============================================================================
// Project Response Schema
// ============================================================================

export const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  owner_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

// ============================================================================
// List My Projects
// ============================================================================

export const ListProjectsResponseSchema = ApiResponseSchema(
  z.array(ProjectResponseSchema).nullable(),
);

export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

/**
 * Retrieve all projects owned by the authenticated user.
 */
export async function listMyProjects(): Promise<ListProjectsResponse> {
  const apiClient = APIService.getClient();

  const response = await apiClient.get("projects");

  // Validate output
  const validatedOutput = ListProjectsResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Get Project
// ============================================================================

export const GetProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});

export const GetProjectResponseSchema = ApiResponseSchema(
  ProjectResponseSchema,
);

export type GetProjectParams = z.infer<typeof GetProjectParamsSchema>;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;

/**
 * Retrieve a specific project by ID.
 * Only the owner can access their project.
 */
export async function getProject(
  params: GetProjectParams,
): Promise<GetProjectResponse> {
  // Validate input
  const validatedInput = GetProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const response = await apiClient.get(`projects/${validatedInput.data.id}`);

  // Validate output
  const validatedOutput = GetProjectResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Create Project
// ============================================================================

export const CreateProjectParamsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters"),
});

export const CreateProjectResponseSchema = ApiResponseSchema(
  ProjectResponseSchema,
);

export type CreateProjectParams = z.infer<typeof CreateProjectParamsSchema>;
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

/**
 * Create a new project.
 * The authenticated user becomes the owner.
 */
export async function createProject(
  params: CreateProjectParams,
): Promise<CreateProjectResponse> {
  // Validate input
  const validatedInput = CreateProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    title: validatedInput.data.title,
    description: validatedInput.data.description,
  };

  const response = await apiClient.post("projects", payload);

  // Validate output
  const validatedOutput = CreateProjectResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Update Project
// ============================================================================

export const UpdateProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const UpdateProjectResponseSchema = ApiResponseSchema(
  ProjectResponseSchema,
);

export type UpdateProjectParams = z.infer<typeof UpdateProjectParamsSchema>;
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

/**
 * Update a project's title and/or description.
 * Only the owner can update.
 */
export async function updateProject(
  params: UpdateProjectParams,
): Promise<UpdateProjectResponse> {
  // Validate input
  const validatedInput = UpdateProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  // Only include fields that are provided
  const payload: { title?: string; description?: string } = {};
  if (validatedInput.data.title !== undefined) {
    payload.title = validatedInput.data.title;
  }
  if (validatedInput.data.description !== undefined) {
    payload.description = validatedInput.data.description;
  }

  const response = await apiClient.patch(
    `projects/${validatedInput.data.id}`,
    payload,
  );

  // Validate output
  const validatedOutput = UpdateProjectResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Delete Project
// ============================================================================

export const DeleteProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});

export const DeleteProjectResponseSchema = ApiResponseSchema(EmptyDataSchema);

export type DeleteProjectParams = z.infer<typeof DeleteProjectParamsSchema>;
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

/**
 * Soft delete a project.
 * Only the owner can delete.
 */
export async function deleteProject(
  params: DeleteProjectParams,
): Promise<DeleteProjectResponse> {
  // Validate input
  const validatedInput = DeleteProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const response = await apiClient.delete(`projects/${validatedInput.data.id}`);

  // Validate output
  const validatedOutput = DeleteProjectResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}

// ============================================================================
// Transfer Project Ownership
// ============================================================================

export const TransferOwnershipParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  new_owner_id: z.string().uuid("Invalid new owner ID format"),
});

export const TransferOwnershipResponseSchema = ApiResponseSchema(
  ProjectResponseSchema,
);

export type TransferOwnershipParams = z.infer<
  typeof TransferOwnershipParamsSchema
>;
export type TransferOwnershipResponse = z.infer<
  typeof TransferOwnershipResponseSchema
>;

/**
 * Transfer ownership of a project to another user.
 * Only the current owner can transfer.
 */
export async function transferOwnership(
  params: TransferOwnershipParams,
): Promise<TransferOwnershipResponse> {
  // Validate input
  const validatedInput = TransferOwnershipParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();

  const payload = {
    new_owner_id: validatedInput.data.new_owner_id,
  };

  const response = await apiClient.post(
    `projects/${validatedInput.data.id}/transfer`,
    payload,
  );

  // Validate output
  const validatedOutput = TransferOwnershipResponseSchema.safeParse(
    response.data,
  );
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}
