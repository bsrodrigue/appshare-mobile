import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

// ============================================================================
// Project Response Schema
// ============================================================================

export const ProjectResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  owner_id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
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
// Action Params
// ============================================================================

export const GetProjectParamsSchema = z.object({
  id: z.uuid("Invalid project ID format"),
});
export type GetProjectParams = z.infer<typeof GetProjectParamsSchema>;

export const CreateProjectParamsSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
});
export type CreateProjectParams = z.infer<typeof CreateProjectParamsSchema>;

export const UpdateProjectParamsSchema = z.object({
  id: z.uuid("Invalid project ID format"),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
});
export type UpdateProjectParams = z.infer<typeof UpdateProjectParamsSchema>;

export const DeleteProjectParamsSchema = z.object({
  id: z.uuid("Invalid project ID format"),
});
export type DeleteProjectParams = z.infer<typeof DeleteProjectParamsSchema>;

export const TransferOwnershipParamsSchema = z.object({
  id: z.uuid("Invalid project ID format"),
  new_owner_id: z.uuid("Invalid new owner ID format"),
});
export type TransferOwnershipParams = z.infer<
  typeof TransferOwnershipParamsSchema
>;
