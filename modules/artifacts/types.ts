import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

// ============================================================================
// Artifact Upload Schemas
// ============================================================================

export const UploadURLRequestSchema = z.object({
  filename: z.string().min(1, "Le nom du fichier est requis"),
  release_id: z.string().uuid().or(z.string().min(1)), // Accepts release or application ID
});

export type UploadURLRequest = z.infer<typeof UploadURLRequestSchema>;

export const UploadURLResponseSchema = z.object({
  file_url: z.string().url(),
  path: z.string(),
  upload_url: z.string().url(),
  release_id: z.uuid(), // The ID of the created/target release
});

export type UploadURLResponse = z.infer<typeof UploadURLResponseSchema>;

export const UploadURLApiResponseSchema = ApiResponseSchema(
  UploadURLResponseSchema,
);

// ============================================================================
// Create Artifact Schemas
// ============================================================================

export const CreateArtifactParamsSchema = z.object({
  release_id: z.uuid(),
  file_url: z.url(),
  file_type: z.string(),
  file_size: z.number().int(),
  abi: z.string().optional(),
  sha256: z.string(),
});

export type CreateArtifactParams = z.infer<typeof CreateArtifactParamsSchema>;

// ============================================================================
// Artifact Types (Future proofing)
// ============================================================================

export const ArtifactResponseSchema = z.object({
  id: z.uuid(),
  release_id: z.uuid(),
  file_url: z.url(),
  file_type: z.string(),
  file_size: z.number().int(),
  abi: z.string().nullable().optional(),
  sha256: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type ArtifactResponse = z.infer<typeof ArtifactResponseSchema>;

export const ArtifactListApiResponseSchema = ApiResponseSchema(
  z.array(ArtifactResponseSchema),
);

export const CreateArtifactApiResponseSchema = ApiResponseSchema(
  ArtifactResponseSchema,
);
