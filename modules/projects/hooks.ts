import {
  ListProjectsResponse,
  GetProjectParams,
  GetProjectResponse,
  CreateProjectParams,
  CreateProjectResponse,
  UpdateProjectParams,
  UpdateProjectResponse,
  DeleteProjectParams,
  DeleteProjectResponse,
  TransferOwnershipParams,
  TransferOwnershipResponse,
  listMyProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  transferOwnership,
} from "@/modules/projects/api";
import { useCall } from "@/hooks/api";

// ============================================================================
// List My Projects
// ============================================================================

export interface UseListProjectsParams {
  onSuccess?: (response: ListProjectsResponse) => void;
  onError?: (error: string) => void;
}

export function useListProjects({
  onSuccess,
  onError,
}: UseListProjectsParams = {}) {
  const { execute, loading, data } = useCall<ListProjectsResponse, void>({
    fn: listMyProjects,
    onSuccess,
    onError,
  });

  return {
    callListProjects: execute,
    isLoading: loading,
    projects: data?.data ?? [],
  };
}

// ============================================================================
// Get Project
// ============================================================================

export interface UseGetProjectParams {
  onSuccess?: (response: GetProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useGetProject({
  onSuccess,
  onError,
}: UseGetProjectParams = {}) {
  const { execute, loading, data } = useCall<
    GetProjectResponse,
    GetProjectParams
  >({
    fn: getProject,
    onSuccess,
    onError,
  });

  return {
    callGetProject: execute,
    isLoading: loading,
    project: data?.data ?? null,
  };
}

// ============================================================================
// Create Project
// ============================================================================

export interface UseCreateProjectParams {
  onSuccess?: (response: CreateProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateProject({
  onSuccess,
  onError,
}: UseCreateProjectParams = {}) {
  const { execute, loading, data } = useCall<
    CreateProjectResponse,
    CreateProjectParams
  >({
    fn: createProject,
    onSuccess,
    onError,
  });

  return {
    callCreateProject: execute,
    isLoading: loading,
    createdProject: data?.data ?? null,
  };
}

// ============================================================================
// Update Project
// ============================================================================

export interface UseUpdateProjectParams {
  onSuccess?: (response: UpdateProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useUpdateProject({
  onSuccess,
  onError,
}: UseUpdateProjectParams = {}) {
  const { execute, loading, data } = useCall<
    UpdateProjectResponse,
    UpdateProjectParams
  >({
    fn: updateProject,
    onSuccess,
    onError,
  });

  return {
    callUpdateProject: execute,
    isLoading: loading,
    updatedProject: data?.data ?? null,
  };
}

// ============================================================================
// Delete Project
// ============================================================================

export interface UseDeleteProjectParams {
  onSuccess?: (response: DeleteProjectResponse) => void;
  onError?: (error: string) => void;
}

export function useDeleteProject({
  onSuccess,
  onError,
}: UseDeleteProjectParams = {}) {
  const { execute, loading } = useCall<
    DeleteProjectResponse,
    DeleteProjectParams
  >({
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
  onSuccess?: (response: TransferOwnershipResponse) => void;
  onError?: (error: string) => void;
}

export function useTransferOwnership({
  onSuccess,
  onError,
}: UseTransferOwnershipParams = {}) {
  const { execute, loading, data } = useCall<
    TransferOwnershipResponse,
    TransferOwnershipParams
  >({
    fn: transferOwnership,
    onSuccess,
    onError,
  });

  return {
    callTransferOwnership: execute,
    isLoading: loading,
    transferredProject: data?.data ?? null,
  };
}
