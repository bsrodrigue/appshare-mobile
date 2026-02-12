import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Logger } from "@/libs/log";
import { getGenericUploadUrl } from "./api";
import { GenericUploadURLResponse, UploadProgress } from "./types";

const logger = new Logger("GenericUploadService");

export class GenericUploadService {
  /**
   * Orchestrates the full process of uploading any file.
   * 1. Picks a file (if not provided).
   * 2. Gets a signed URL from the backend.
   * 3. Uploads the file directly to the signed URL (R2).
   */
  static async uploadFile(
    file?: DocumentPicker.DocumentPickerAsset,
    onProgress?: (progress: UploadProgress) => void,
    allowedTypes: string[] = ["*/*"],
  ): Promise<GenericUploadURLResponse> {
    try {
      // 1. Pick File if not provided
      let selectedFile = file;
      if (!selectedFile) {
        const result = await DocumentPicker.getDocumentAsync({
          type: allowedTypes,
          copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets.length) {
          throw new Error("Upload annulé : aucun fichier sélectionné");
        }
        selectedFile = result.assets[0];
      }

      logger.debug(`Starting generic upload for file: ${selectedFile.name}`, {
        uri: selectedFile.uri,
        expectedSize: selectedFile.size,
      });

      // 2. Get Signed URL
      const uploadDetails = await getGenericUploadUrl({
        filename: selectedFile.name,
      });

      logger.debug("Generic signed URL obtained successfully", {
        path: uploadDetails.path,
      });

      // 3. Perform Direct Upload to R2 using the legacy uploadAsync
      // This is the most memory-efficient way because it streams directly from the native side.
      logger.debug(
        `PERFORMING DIRECT PUT TO R2: ${uploadDetails.upload_url.split("?")[0]}`,
      );

      const response = await FileSystem.uploadAsync(
        uploadDetails.upload_url,
        selectedFile.uri,
        {
          httpMethod: "PUT",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            "Content-Type": selectedFile.mimeType || "application/octet-stream",
          },
        },
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `R2 Upload failed with status ${response.status}: ${response.body}`,
        );
      }

      logger.info("Direct R2 upload completed successfully", {
        filename: selectedFile.name,
        path: uploadDetails.path,
        status: response.status,
      });

      return uploadDetails;
    } catch (error: any) {
      logger.error(`Generic upload failed: ${error.message}`);
      throw error;
    }
  }
}
