import { z } from "zod";
import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/types/errors";
import { ApiResponseSchema, EmptyDataSchema, EmptyData } from "@/types/api";

// ============================================================================
// Project Response Schema
// ============================================================================

export const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  owner_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

// ============================================================================
// API Response Wrappers
// ============================================================================

export const ProjectApiResponseSchema = ApiResponseSchema(
  ProjectResponseSchema,
);
export const ProjectsListApiResponseSchema = ApiResponseSchema(
  z.array(ProjectResponseSchema).nullable(),
);

// ============================================================================
// List My Projects
// ============================================================================

/**
 * Retrieve all projects owned by the authenticated user.
 */
export async function listMyProjects(): Promise<ProjectResponse[] | null> {
  const apiClient = APIService.getClient();
  const response = await apiClient.get<ProjectResponse[] | null>("projects");

  const validatedOutput = ProjectsListApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
}

// ============================================================================
// Get Project
// ============================================================================

export const GetProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});

export type GetProjectParams = z.infer<typeof GetProjectParamsSchema>;

/**
 * Retrieve a specific project by ID.
 * Only the owner can access their project.
 */
export async function getProject(
  params: GetProjectParams,
): Promise<ProjectResponse> {
  const validatedInput = GetProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();
  const response = await apiClient.get<ProjectResponse>(
    `projects/${validatedInput.data.id}`,
  );

  const validatedOutput = ProjectApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
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

export type CreateProjectParams = z.infer<typeof CreateProjectParamsSchema>;

/**
 * Create a new project.
 * The authenticated user becomes the owner.
 */
export async function createProject(
  params: CreateProjectParams,
): Promise<ProjectResponse> {
  const validatedInput = CreateProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();
  const response = await apiClient.post<ProjectResponse>(
    "projects",
    validatedInput.data,
  );

  const validatedOutput = ProjectApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
}

// ============================================================================
// Update Project
// ============================================================================

export const UpdateProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
});

export type UpdateProjectParams = z.infer<typeof UpdateProjectParamsSchema>;

/**
 * Update a project's title and/or description.
 * Only the owner can update.
 */
export async function updateProject(
  params: UpdateProjectParams,
): Promise<ProjectResponse> {
  const validatedInput = UpdateProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const { id, ...payload } = validatedInput.data;

  const apiClient = APIService.getClient();
  const response = await apiClient.patch<ProjectResponse>(
    `projects/${id}`,
    payload,
  );

  const validatedOutput = ProjectApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
}

// ============================================================================
// Delete Project
// ============================================================================

export const DeleteProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});

export type DeleteProjectParams = z.infer<typeof DeleteProjectParamsSchema>;

/**
 * Soft delete a project.
 * Only the owner can delete.
 */
export async function deleteProject(
  params: DeleteProjectParams,
): Promise<EmptyData> {
  const validatedInput = DeleteProjectParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const apiClient = APIService.getClient();
  const response = await apiClient.delete<EmptyData>(
    `projects/${validatedInput.data.id}`,
  );

  const validatedOutput =
    ApiResponseSchema(EmptyDataSchema).safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
}

// ============================================================================
// Transfer Project Ownership
// ============================================================================

export const TransferOwnershipParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  new_owner_id: z.string().uuid("Invalid new owner ID format"),
});

export type TransferOwnershipParams = z.infer<
  typeof TransferOwnershipParamsSchema
>;

/**
 * Transfer ownership of a project to another user.
 * Only the current owner can transfer.
 */
export async function transferOwnership(
  params: TransferOwnershipParams,
): Promise<ProjectResponse> {
  const validatedInput = TransferOwnershipParamsSchema.safeParse(params);
  if (!validatedInput.success) {
    throw new ApiInputError(validatedInput.error);
  }

  const { id, new_owner_id } = validatedInput.data;

  const apiClient = APIService.getClient();
  const response = await apiClient.post<ProjectResponse>(
    `projects/${id}/transfer`,
    {
      new_owner_id,
    },
  );

  const validatedOutput = ProjectApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data.data;
}
