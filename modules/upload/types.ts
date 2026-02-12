import { z } from "zod";
import { ApiResponseSchema } from "@/modules/shared/types";

// ============================================================================
// Generic Upload Schemas
// ============================================================================

export const GenericUploadURLRequestSchema = z.object({
  filename: z.string().min(1, "Le nom du fichier est requis"),
});

export type GenericUploadURLRequest = z.infer<
  typeof GenericUploadURLRequestSchema
>;

export const GenericUploadURLResponseSchema = z.object({
  file_url: z.string().url(),
  path: z.string(),
  upload_url: z.string().url(),
});

export type GenericUploadURLResponse = z.infer<
  typeof GenericUploadURLResponseSchema
>;

export const GenericUploadURLApiResponseSchema = ApiResponseSchema(
  GenericUploadURLResponseSchema,
);

export interface UploadProgress {
  loaded: number;
  total: number;
  progress: number;
}
