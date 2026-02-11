import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared";
import {
  ApiResponseSchema,
  EmptyDataSchema,
  EmptyData,
} from "@/modules/shared/types";
import {
  ProjectResponse,
  ProjectApiResponseSchema,
  ProjectsListApiResponseSchema,
  GetProjectParams,
  GetProjectParamsSchema,
  CreateProjectParams,
  CreateProjectParamsSchema,
  UpdateProjectParams,
  UpdateProjectParamsSchema,
  DeleteProjectParams,
  DeleteProjectParamsSchema,
  TransferOwnershipParams,
  TransferOwnershipParamsSchema,
} from "./types";

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
