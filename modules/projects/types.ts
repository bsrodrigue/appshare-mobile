import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

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
// Action Params
// ============================================================================

export const GetProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});
export type GetProjectParams = z.infer<typeof GetProjectParamsSchema>;

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

export const UpdateProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
});
export type UpdateProjectParams = z.infer<typeof UpdateProjectParamsSchema>;

export const DeleteProjectParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});
export type DeleteProjectParams = z.infer<typeof DeleteProjectParamsSchema>;

export const TransferOwnershipParamsSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
  new_owner_id: z.string().uuid("Invalid new owner ID format"),
});
export type TransferOwnershipParams = z.infer<
  typeof TransferOwnershipParamsSchema
>;
