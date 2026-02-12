import { useState, useCallback } from "react";
import { GenericUploadService } from "./service";
import { GenericUploadURLResponse, UploadProgress } from "./types";
import * as DocumentPicker from "expo-document-picker";

export function useGenericUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file?: DocumentPicker.DocumentPickerAsset,
      allowedTypes: string[] = ["*/*"],
    ): Promise<GenericUploadURLResponse | null> => {
      setIsUploading(true);
      setProgress(null);
      setError(null);

      try {
        const result = await GenericUploadService.uploadFile(
          file,
          (p) => setProgress(p),
          allowedTypes,
        );
        return result;
      } catch (err: any) {
        const message = err.message || "Échec de l'upload du fichier";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    upload,
    reset,
    isUploading,
    progress,
    error,
  };
}
