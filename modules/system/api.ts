import { z } from "zod";
import { APIService } from "@/libs/api/client";
import { ApiOutputError } from "@/types/errors";
import { ApiResponseSchema } from "@/types/api";

// ============================================================================
// Health Check
// ============================================================================

export const HealthCheckResponseSchema = ApiResponseSchema(z.string());

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

/**
 * Verify the service is up and running.
 */
export async function healthCheck(): Promise<HealthCheckResponse> {
  const apiClient = APIService.getClient();

  const response = await apiClient.get("health");

  // Validate output
  const validatedOutput = HealthCheckResponseSchema.safeParse(response.data);
  if (!validatedOutput.success) {
    throw new ApiOutputError(validatedOutput.error);
  }

  return validatedOutput.data;
}
