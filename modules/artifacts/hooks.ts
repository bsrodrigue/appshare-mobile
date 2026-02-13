import { useState, useCallback } from "react";
import { ArtifactUploadService, UploadProgress } from "./service";
import { listArtifacts, createArtifact } from "./api";
import {
  UploadURLResponse,
  ArtifactResponse,
  CreateArtifactParams,
} from "./types";
import { useCall } from "@/hooks/api";
import * as DocumentPicker from "expo-document-picker";

export function useArtifactUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      releaseId: string,
      file?: DocumentPicker.DocumentPickerAsset,
    ): Promise<UploadURLResponse | null> => {
      setIsUploading(true);
      setProgress(null);
      setError(null);

      try {
        const result = await ArtifactUploadService.uploadArtifact(
          releaseId,
          file,
          (p) => setProgress(p),
        );
        return result;
      } catch (err: any) {
        const message = err.message || "Échec de l'upload de l'artéfact";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    upload,
    isUploading,
    progress,
    error,
  };
}

export interface UseListArtifactsParams {
  onSuccess?: (response: ArtifactResponse[]) => void;
  onError?: (error: string) => void;
}

export function useListArtifacts({
  onSuccess,
  onError,
}: UseListArtifactsParams = {}) {
  const { execute, loading } = useCall<ArtifactResponse[], string>({
    fn: listArtifacts,
    onSuccess,
    onError,
  });

  return {
    callListArtifacts: execute,
    isLoading: loading,
  };
}

export interface UseCreateArtifactParams {
  onSuccess?: (response: ArtifactResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateArtifact({
  onSuccess,
  onError,
}: UseCreateArtifactParams = {}) {
  const { execute, loading } = useCall<ArtifactResponse, CreateArtifactParams>({
    fn: createArtifact,
    onSuccess,
    onError,
  });

  return {
    callCreateArtifact: execute,
    isLoading: loading,
  };
}
