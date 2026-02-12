import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import {
  UploadURLRequest,
  UploadURLRequestSchema,
  UploadURLResponse,
  UploadURLApiResponseSchema,
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
