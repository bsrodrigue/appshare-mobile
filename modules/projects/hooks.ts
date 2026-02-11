import {
  listMyProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  transferOwnership,
  ProjectResponse,
  CreateProjectParams,
  GetProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  TransferOwnershipParams,
} from "./api";
import { useCall } from "@/hooks/api";

// ============================================================================
// List Projects
// ============================================================================

export interface UseListProjectsParams {
  onSuccess?: (response: ProjectResponse[] | null) => void;
  onError?: (error: string) => void;
}

export function useListProjects({
  onSuccess,
  onError,
}: UseListProjectsParams = {}) {
  const { execute, loading } = useCall<ProjectResponse[] | null, void>({
    fn: listMyProjects,
    onSuccess,
    onError,
  });

  return {
    callListProjects: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Get Project
// ============================================================================

export interface UseGetProjectParams {
  onSuccess?: (response: ProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useGetProject({
  onSuccess,
  onError,
}: UseGetProjectParams = {}) {
  const { execute, loading } = useCall<ProjectResponse, GetProjectParams>({
    fn: getProject,
    onSuccess,
    onError,
  });

  return {
    callGetProject: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Create Project
// ============================================================================

export interface UseCreateProjectParams {
  onSuccess?: (response: ProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateProject({
  onSuccess,
  onError,
}: UseCreateProjectParams = {}) {
  const { execute, loading } = useCall<ProjectResponse, CreateProjectParams>({
    fn: createProject,
    onSuccess,
    onError,
  });

  return {
    callCreateProject: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Update Project
// ============================================================================

export interface UseUpdateProjectParams {
  onSuccess?: (response: ProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useUpdateProject({
  onSuccess,
  onError,
}: UseUpdateProjectParams = {}) {
  const { execute, loading } = useCall<ProjectResponse, UpdateProjectParams>({
    fn: updateProject,
    onSuccess,
    onError,
  });

  return {
    callUpdateProject: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Delete Project
// ============================================================================

export interface UseDeleteProjectParams {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteProject({
  onSuccess,
  onError,
}: UseDeleteProjectParams = {}) {
  const { execute, loading } = useCall<any, DeleteProjectParams>({
    fn: deleteProject,
    onSuccess,
    onError,
  });

  return {
    callDeleteProject: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Transfer Ownership
// ============================================================================

export interface UseTransferOwnershipParams {
  onSuccess?: (response: ProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useTransferOwnership({
  onSuccess,
  onError,
}: UseTransferOwnershipParams = {}) {
  const { execute, loading } = useCall<
    ProjectResponse,
    TransferOwnershipParams
  >({
    fn: transferOwnership,
    onSuccess,
    onError,
  });

  return {
    callTransferOwnership: execute,
    isLoading: loading,
  };
}
