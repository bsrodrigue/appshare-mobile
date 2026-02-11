import {
  listApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} from "./api";
import {
  ApplicationResponse,
  CreateApplicationParams,
  GetApplicationParams,
  UpdateApplicationParams,
  DeleteApplicationParams,
  ListApplicationsParams,
} from "./types";
import { useCall } from "@/hooks/api";
import { EmptyData } from "@/modules/shared/types";

// ============================================================================
// List Applications
// ============================================================================

export interface UseListApplicationsParams {
  onSuccess?: (response: ApplicationResponse[]) => void;
  onError?: (error: string) => void;
}

export function useListApplications({
  onSuccess,
  onError,
}: UseListApplicationsParams = {}) {
  const { execute, loading } = useCall<
    ApplicationResponse[],
    ListApplicationsParams
  >({
    fn: listApplications,
    onSuccess,
    onError,
  });

  return {
    callListApplications: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Get Application
// ============================================================================

export interface UseGetApplicationParams {
  onSuccess?: (response: ApplicationResponse) => void;
  onError?: (error: string) => void;
}

export function useGetApplication({
  onSuccess,
  onError,
}: UseGetApplicationParams = {}) {
  const { execute, loading } = useCall<
    ApplicationResponse,
    GetApplicationParams
  >({
    fn: getApplication,
    onSuccess,
    onError,
  });

  return {
    callGetApplication: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Create Application
// ============================================================================

export interface UseCreateApplicationParams {
  onSuccess?: (response: ApplicationResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateApplication({
  onSuccess,
  onError,
}: UseCreateApplicationParams = {}) {
  const { execute, loading } = useCall<
    ApplicationResponse,
    CreateApplicationParams
  >({
    fn: createApplication,
    onSuccess,
    onError,
  });

  return {
    callCreateApplication: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Update Application
// ============================================================================

export interface UseUpdateApplicationParams {
  onSuccess?: (response: ApplicationResponse) => void;
  onError?: (error: string) => void;
}

export function useUpdateApplication({
  onSuccess,
  onError,
}: UseUpdateApplicationParams = {}) {
  const { execute, loading } = useCall<
    ApplicationResponse,
    UpdateApplicationParams
  >({
    fn: updateApplication,
    onSuccess,
    onError,
  });

  return {
    callUpdateApplication: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Delete Application
// ============================================================================

export interface UseDeleteApplicationParams {
  onSuccess?: (response: EmptyData) => void;
  onError?: (error: string) => void;
}

export function useDeleteApplication({
  onSuccess,
  onError,
}: UseDeleteApplicationParams = {}) {
  const { execute, loading } = useCall<EmptyData, DeleteApplicationParams>({
    fn: deleteApplication,
    onSuccess,
    onError,
  });

  return {
    callDeleteApplication: execute,
    isLoading: loading,
  };
}
