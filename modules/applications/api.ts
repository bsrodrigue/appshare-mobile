import { APIService } from "@/libs/api/client";
import { ApiInputError, ApiOutputError } from "@/modules/shared/errors";
import { ApiResponseSchema, EmptyDataSchema } from "@/modules/shared/types";
import type { EmptyData } from "@/modules/shared/types";
import {
  ApplicationResponse,
  ApplicationApiResponseSchema,
  ApplicationsListApiResponseSchema,
  CreateApplicationParams,
  CreateApplicationParamsSchema,
  CreateApplicationFromBinaryParams,
  CreateApplicationFromBinaryParamsSchema,
  UpdateApplicationParams,
  UpdateApplicationParamsSchema,
  DeleteApplicationParams,
  DeleteApplicationParamsSchema,
  GetApplicationParams,
  GetApplicationParamsSchema,
  ListApplicationsParams,
  ListApplicationsParamsSchema,
} from "./types";

// ============================================================================
// Applications API Endpoints
// ============================================================================

export async function listApplications(
  params: ListApplicationsParams,
): Promise<ApplicationResponse[]> {
  const validatedInput = ListApplicationsParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.get<ApplicationResponse[]>(
    `projects/${validatedInput.data.project_id}/applications`,
  );

  const validatedOutput = ApplicationsListApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data || [];
}

export async function createApplication(
  params: CreateApplicationParams,
): Promise<ApplicationResponse> {
  const validatedInput = CreateApplicationParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { project_id, ...body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.post<ApplicationResponse>(
    `projects/${project_id}/applications`,
    body,
  );

  const validatedOutput = ApplicationApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function createApplicationFromBinary(
  params: CreateApplicationFromBinaryParams,
): Promise<ApplicationResponse> {
  const validatedInput =
    CreateApplicationFromBinaryParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.post<ApplicationResponse>(
    "create-application-from-binary",
    validatedInput.data,
  );

  const validatedOutput = ApplicationApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function getApplication(
  params: GetApplicationParams,
): Promise<ApplicationResponse> {
  const validatedInput = GetApplicationParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.get<ApplicationResponse>(
    `applications/${validatedInput.data.id}`,
  );

  const validatedOutput = ApplicationApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function updateApplication(
  params: UpdateApplicationParams,
): Promise<ApplicationResponse> {
  const validatedInput = UpdateApplicationParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const { id, ...body } = validatedInput.data;
  const apiClient = APIService.getClient();
  const response = await apiClient.patch<ApplicationResponse>(
    `applications/${id}`,
    body,
  );

  const validatedOutput = ApplicationApiResponseSchema.safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}

export async function deleteApplication(
  params: DeleteApplicationParams,
): Promise<EmptyData> {
  const validatedInput = DeleteApplicationParamsSchema.safeParse(params);
  if (!validatedInput.success) throw new ApiInputError(validatedInput.error);

  const apiClient = APIService.getClient();
  const response = await apiClient.delete<EmptyData>(
    `applications/${validatedInput.data.id}`,
  );

  const validatedOutput =
    ApiResponseSchema(EmptyDataSchema).safeParse(response);
  if (!validatedOutput.success) throw new ApiOutputError(validatedOutput.error);

  return validatedOutput.data.data;
}
