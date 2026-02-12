import {
  listReleases,
  createRelease,
  createReleaseWithArtifact,
  getRelease,
  updateRelease,
  deleteRelease,
  promoteRelease,
} from "./api";
import {
  ReleaseResponse,
  CreateReleaseParams,
  CreateReleaseWithArtifactParams,
  GetReleaseParams,
  UpdateReleaseParams,
  DeleteReleaseParams,
  ListReleasesParams,
  PromoteReleaseParams,
} from "./types";
import { useCall } from "@/hooks/api";
import { EmptyData } from "@/modules/shared/types";

// ============================================================================
// List Releases
// ============================================================================

export interface UseListReleasesParams {
  onSuccess?: (response: ReleaseResponse[]) => void;
  onError?: (error: string) => void;
}

export function useListReleases({
  onSuccess,
  onError,
}: UseListReleasesParams = {}) {
  const { execute, loading } = useCall<ReleaseResponse[], ListReleasesParams>({
    fn: listReleases,
    onSuccess,
    onError,
  });

  return {
    callListReleases: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Get Release
// ============================================================================

export interface UseGetReleaseParams {
  onSuccess?: (response: ReleaseResponse) => void;
  onError?: (error: string) => void;
}

export function useGetRelease({
  onSuccess,
  onError,
}: UseGetReleaseParams = {}) {
  const { execute, loading } = useCall<ReleaseResponse, GetReleaseParams>({
    fn: getRelease,
    onSuccess,
    onError,
  });

  return {
    callGetRelease: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Create Release
// ============================================================================

export interface UseCreateReleaseParams {
  onSuccess?: (response: ReleaseResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateRelease({
  onSuccess,
  onError,
}: UseCreateReleaseParams = {}) {
  const { execute, loading } = useCall<ReleaseResponse, CreateReleaseParams>({
    fn: createRelease,
    onSuccess,
    onError,
  });

  return {
    callCreateRelease: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Create Release with Artifact
// ============================================================================

export interface UseCreateReleaseWithArtifactParams {
  onSuccess?: (response: ReleaseResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateReleaseWithArtifact({
  onSuccess,
  onError,
}: UseCreateReleaseWithArtifactParams = {}) {
  const { execute, loading } = useCall<
    ReleaseResponse,
    CreateReleaseWithArtifactParams
  >({
    fn: createReleaseWithArtifact,
    onSuccess,
    onError,
  });

  return {
    callCreateReleaseWithArtifact: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Update Release
// ============================================================================

export interface UseUpdateReleaseParams {
  onSuccess?: (response: ReleaseResponse) => void;
  onError?: (error: string) => void;
}

export function useUpdateRelease({
  onSuccess,
  onError,
}: UseUpdateReleaseParams = {}) {
  const { execute, loading } = useCall<ReleaseResponse, UpdateReleaseParams>({
    fn: updateRelease,
    onSuccess,
    onError,
  });

  return {
    callUpdateRelease: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Delete Release
// ============================================================================

export interface UseDeleteReleaseParams {
  onSuccess?: (response: EmptyData) => void;
  onError?: (error: string) => void;
}

export function useDeleteRelease({
  onSuccess,
  onError,
}: UseDeleteReleaseParams = {}) {
  const { execute, loading } = useCall<EmptyData, DeleteReleaseParams>({
    fn: deleteRelease,
    onSuccess,
    onError,
  });

  return {
    callDeleteRelease: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Promote Release
// ============================================================================

export interface UsePromoteReleaseParams {
  onSuccess?: (response: ReleaseResponse) => void;
  onError?: (error: string) => void;
}

export function usePromoteRelease({
  onSuccess,
  onError,
}: UsePromoteReleaseParams = {}) {
  const { execute, loading } = useCall<ReleaseResponse, PromoteReleaseParams>({
    fn: promoteRelease,
    onSuccess,
    onError,
  });

  return {
    callPromoteRelease: execute,
    isLoading: loading,
  };
}
