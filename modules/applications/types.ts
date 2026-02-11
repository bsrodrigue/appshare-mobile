import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

// ============================================================================
// Application Response Schema
// ============================================================================

export const ApplicationResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3).max(100),
  package_name: z.string().min(3).max(255),
  description: z.string().max(1000),
  project_id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type ApplicationResponse = z.infer<typeof ApplicationResponseSchema>;

// ============================================================================
// API Response Wrappers
// ============================================================================

export const ApplicationApiResponseSchema = ApiResponseSchema(
  ApplicationResponseSchema,
);
export const ApplicationsListApiResponseSchema = ApiResponseSchema(
  z.array(ApplicationResponseSchema).nullable(),
);

// ============================================================================
// Action Params
// ============================================================================

export const CreateApplicationParamsSchema = z.object({
  project_id: z.uuid(),
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100),
  package_name: z
    .string()
    .min(3, "Le nom de package doit faire au moins 3 caractères")
    .max(255),
  description: z
    .string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
});

export type CreateApplicationParams = z.infer<
  typeof CreateApplicationParamsSchema
>;

export const UpdateApplicationParamsSchema = z.object({
  id: z.uuid(),
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100),
  description: z
    .string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
});

export type UpdateApplicationParams = z.infer<
  typeof UpdateApplicationParamsSchema
>;

export const DeleteApplicationParamsSchema = z.object({
  id: z.uuid(),
});

export type DeleteApplicationParams = z.infer<
  typeof DeleteApplicationParamsSchema
>;

export const GetApplicationParamsSchema = z.object({
  id: z.uuid(),
});

export type GetApplicationParams = z.infer<typeof GetApplicationParamsSchema>;

export const ListApplicationsParamsSchema = z.object({
  project_id: z.uuid(),
});

export type ListApplicationsParams = z.infer<
  typeof ListApplicationsParamsSchema
>;
