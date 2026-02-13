import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import {
  UploadURLRequest,
  UploadURLRequestSchema,
  UploadURLResponse,
  UploadURLApiResponseSchema,
  ArtifactResponse,
  ArtifactListApiResponseSchema,
  CreateArtifactParams,
  CreateArtifactParamsSchema,
  CreateArtifactApiResponseSchema,
} from "./types";

/**
 * Generates a signed URL for uploading an artifact.
 */
export async function getUploadUrl(
  params: UploadURLRequest,
): Promise<UploadURLResponse> {
  const validatedInput = UploadURLRequestSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<UploadURLResponse>(
    "artifacts/upload-url",
    validatedInput.data,
  );

  const validatedOutput = UploadURLApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

/**
 * Lists all artifacts for a specific release.
 */
export async function listArtifacts(
  releaseId: string,
): Promise<ArtifactResponse[]> {
  const apiClient = APIService.getClient();
  const response = await apiClient.get<ArtifactResponse[]>(
    `releases/${releaseId}/artifacts`,
  );

  const validatedOutput = ArtifactListApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data || [];
}

/**
 * Creates a new artifact record.
 */
export async function createArtifact(
  params: CreateArtifactParams,
): Promise<ArtifactResponse> {
  const validatedInput = CreateArtifactParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<ArtifactResponse>(
    "artifacts",
    validatedInput.data,
  );

  const validatedOutput = CreateArtifactApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}
