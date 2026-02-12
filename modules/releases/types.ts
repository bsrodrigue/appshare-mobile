import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

// ============================================================================
// Release Response Schema
// ============================================================================

export const ReleaseResponseSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3).max(100),
  version_code: z.number().int().min(1),
  version_name: z.string(),
  release_note: z.string().max(2000),
  environment: z.enum(["development", "staging", "production"]),
  application_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ReleaseResponse = z.infer<typeof ReleaseResponseSchema>;

// ============================================================================
// API Response Wrappers
// ============================================================================

export const ReleaseApiResponseSchema = ApiResponseSchema(
  ReleaseResponseSchema,
);
export const ReleasesListApiResponseSchema = ApiResponseSchema(
  z.array(ReleaseResponseSchema).nullable(),
);

// ============================================================================
// Action Params
// ============================================================================

/**
 * Base input used by the ReleaseForm
 */
export const ReleaseFormDataSchema = z.object({
  release_note: z
    .string()
    .max(2000, "Les notes de version ne doivent pas dépasser 2000 caractères"),
  environment: z.enum(["development", "staging", "production"]),
});

export type ReleaseFormData = z.infer<typeof ReleaseFormDataSchema>;

/**
 * Legacy/Standard creation schema
 */
export const CreateReleaseInputSchema = ReleaseFormDataSchema.extend({
  artifact_path: z.string().min(1, "Le chemin de l'artéfact est requis"),
});

export type CreateReleaseInput = z.infer<typeof CreateReleaseInputSchema>;

export const CreateReleaseParamsSchema = z.object({
  app_id: z.uuid(),
  body: CreateReleaseInputSchema,
});

export type CreateReleaseParams = z.infer<typeof CreateReleaseParamsSchema>;

/**
 * Creation with pre-uploaded artifact URL
 */
export const CreateReleaseWithArtifactInputSchema =
  ReleaseFormDataSchema.extend({
    artifact_url: z.string().url("URL de l'artéfact invalide"),
  });

export type CreateReleaseWithArtifactInput = z.infer<
  typeof CreateReleaseWithArtifactInputSchema
>;

export const CreateReleaseWithArtifactParamsSchema = z.object({
  app_id: z.uuid(),
  body: CreateReleaseWithArtifactInputSchema,
});

export type CreateReleaseWithArtifactParams = z.infer<
  typeof CreateReleaseWithArtifactParamsSchema
>;

/**
 * Update schema
 */
export const UpdateReleaseInputSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(100)
    .optional(),
  release_note: z
    .string()
    .max(2000, "Les notes de version ne doivent pas dépasser 2000 caractères")
    .optional(),
  environment: z.enum(["development", "staging", "production"]).optional(),
  artifact_path: z.string().optional(),
});

export type UpdateReleaseInput = z.infer<typeof UpdateReleaseInputSchema>;

export const UpdateReleaseParamsSchema = z.object({
  id: z.uuid(),
  body: UpdateReleaseInputSchema,
});

export type UpdateReleaseParams = z.infer<typeof UpdateReleaseParamsSchema>;

export const PromoteReleaseInputSchema = z.object({
  environment: z.enum(["development", "staging", "production"]),
});

export type PromoteReleaseInput = z.infer<typeof PromoteReleaseInputSchema>;

export const PromoteReleaseParamsSchema = z.object({
  id: z.uuid(),
  body: PromoteReleaseInputSchema,
});

export type PromoteReleaseParams = z.infer<typeof PromoteReleaseParamsSchema>;

export const DeleteReleaseParamsSchema = z.object({
  id: z.uuid(),
});

export type DeleteReleaseParams = z.infer<typeof DeleteReleaseParamsSchema>;

export const GetReleaseParamsSchema = z.object({
  id: z.uuid(),
});

export type GetReleaseParams = z.infer<typeof GetReleaseParamsSchema>;

export const ListReleasesParamsSchema = z.object({
  app_id: z.uuid(),
});

export type ListReleasesParams = z.infer<typeof ListReleasesParamsSchema>;
