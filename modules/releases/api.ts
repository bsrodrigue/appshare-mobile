import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import { ApiResponseSchema, EmptyDataSchema } from "@/modules/shared/types";
import type { EmptyData } from "@/modules/shared/types";
import {
  ReleaseResponse,
  ReleaseApiResponseSchema,
  ReleasesListApiResponseSchema,
  CreateReleaseParams,
  CreateReleaseParamsSchema,
  CreateReleaseWithArtifactParams,
  CreateReleaseWithArtifactParamsSchema,
  UpdateReleaseParams,
  UpdateReleaseParamsSchema,
  DeleteReleaseParams,
  DeleteReleaseParamsSchema,
  GetReleaseParams,
  GetReleaseParamsSchema,
  ListReleasesParams,
  ListReleasesParamsSchema,
  PromoteReleaseParams,
  PromoteReleaseParamsSchema,
} from "./types";

// ============================================================================
// Releases API Endpoints
// ============================================================================

export async function listReleases(
  params: ListReleasesParams,
): Promise<ReleaseResponse[]> {
  const validatedInput = ListReleasesParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.get<ReleaseResponse[]>(
    `applications/${validatedInput.data.app_id}/releases`,
  );

  const validatedOutput = ReleasesListApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data || [];
}

export async function createRelease(
  params: CreateReleaseParams,
): Promise<ReleaseResponse> {
  const validatedInput = CreateReleaseParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { app_id, body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.post<ReleaseResponse>(
    `applications/${app_id}/releases`,
    body,
  );

  const validatedOutput = ReleaseApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function createReleaseWithArtifact(
  params: CreateReleaseWithArtifactParams,
): Promise<ReleaseResponse> {
  const validatedInput =
    CreateReleaseWithArtifactParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { app_id, body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.post<ReleaseResponse>(
    `applications/${app_id}/releases/with-artifact`,
    body,
  );

  const validatedOutput = ReleaseApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function getRelease(
  params: GetReleaseParams,
): Promise<ReleaseResponse> {
  const validatedInput = GetReleaseParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.get<ReleaseResponse>(
    `releases/${validatedInput.data.id}`,
  );

  const validatedOutput = ReleaseApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function updateRelease(
  params: UpdateReleaseParams,
): Promise<ReleaseResponse> {
  const validatedInput = UpdateReleaseParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { id, body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.patch<ReleaseResponse>(
    `releases/${id}`,
    body,
  );

  const validatedOutput = ReleaseApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function deleteRelease(
  params: DeleteReleaseParams,
): Promise<EmptyData> {
  const validatedInput = DeleteReleaseParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.delete<EmptyData>(
    `releases/${validatedInput.data.id}`,
  );

  const validatedOutput =
    ApiResponseSchema(EmptyDataSchema).safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function promoteRelease(
  params: PromoteReleaseParams,
): Promise<ReleaseResponse> {
  const validatedInput = PromoteReleaseParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { id, body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.post<ReleaseResponse>(
    `releases/${id}/promote`,
    body,
  );

  const validatedOutput = ReleaseApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}
