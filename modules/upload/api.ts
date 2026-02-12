import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import {
  GenericUploadURLRequest,
  GenericUploadURLRequestSchema,
  GenericUploadURLResponse,
  GenericUploadURLApiResponseSchema,
} from "./types";

/**
 * Generates a signed URL for a generic file upload.
 */
export async function getGenericUploadUrl(
  params: GenericUploadURLRequest,
): Promise<GenericUploadURLResponse> {
  const validatedInput = GenericUploadURLRequestSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<GenericUploadURLResponse>(
    "uploadFile",
    validatedInput.data,
  );

  const validatedOutput = GenericUploadURLApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}
