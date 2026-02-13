import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { getUploadUrl, createArtifact } from "./api";
import { ArtifactResponse } from "./types";
import { Logger } from "@/libs/log";

const logger = new Logger("ArtifactUploadService");

export interface UploadProgress {
  loaded: number;
  total: number;
  progress: number;
}

export class ArtifactUploadService {
  /**
   * Orchestrates the full upload flow:
   * 1. Pick a file (if not provided)
   * 2. Get a signed upload URL from the API
   * 3. Upload the file to Cloudflare R2 via the signed URL
   */
  static async uploadArtifact(
    releaseId: string,
    file?: DocumentPicker.DocumentPickerAsset,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<ArtifactResponse> {
    try {
      // 1. Pick File if not provided
      let selectedFile = file;
      if (!selectedFile) {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/vnd.android.package-archive", // APKs
          copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets.length) {
          throw new Error("Upload annulé : aucun fichier sélectionné");
        }
        selectedFile = result.assets[0];
      }

      logger.debug(`Starting upload for file: ${selectedFile.name}`);

      // 2. Get Signed URL
      const uploadDetails = await getUploadUrl({
        filename: selectedFile.name,
        release_id: releaseId,
      });

      logger.debug("Signed URL obtained successfully");

      // 3. Prepare File for Upload
      // In React Native, for PUT upload to S3/R2 with signed URLs,
      // we often need to fetch the file content as a blob or use a specific library.
      // Using fetch + blob is a reliable way for small to medium files.
      const fileResponse = await fetch(selectedFile.uri);
      const blob = await fileResponse.blob();

      // 4. Perform PUT Upload
      // We use a clean axios instance to avoid our API interceptors
      // (like Authorization header which might break the signed URL signature)
      await axios.put(uploadDetails.upload_url, blob, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = progressEvent.loaded / progressEvent.total;
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              progress,
            });
          }
        },
      });

      logger.debug("File upload to R2 completed successfully");

      // 5. Register Artifact Metadata in DB
      logger.debug("Registering artifact metadata in DB...");
      const artifact = await createArtifact({
        release_id: releaseId,
        file_url: uploadDetails.file_url,
        file_type:
          selectedFile.mimeType || "application/vnd.android.package-archive",
        file_size: selectedFile.size || blob.size,
        sha256: "0".repeat(64), // Placeholder as crypto is not available in current deps
        abi: "universal",
      });

      logger.debug("Artifact metadata registered successfully");

      return artifact;
    } catch (error: any) {
      logger.error("Artifact upload failed", error);
      throw error;
    }
  }
}
