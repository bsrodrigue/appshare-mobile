import {
  ListUsersResponse,
  GetUserParams,
  GetUserResponse,
  CreateUserParams,
  CreateUserResponse,
  UpdateProfileParams,
  UpdateProfileResponse,
  DeleteUserParams,
  DeleteUserResponse,
  listUsers,
  getUser,
  createUser,
  updateProfile,
  deleteUser,
} from "@/modules/users/api";
import { useCall } from "@/hooks/api";

// ============================================================================
// List Users
// ============================================================================

export interface UseListUsersParams {
  onSuccess?: (response: ListUsersResponse) => void;
  onError?: (error: string) => void;
}

export function useListUsers({ onSuccess, onError }: UseListUsersParams = {}) {
  const { execute, loading, data } = useCall<ListUsersResponse, void>({
    fn: listUsers,
    onSuccess,
    onError,
  });

  return {
    callListUsers: execute,
    isLoading: loading,
    users: data?.data ?? [],
  };
}

// ============================================================================
// Get User
// ============================================================================

export interface UseGetUserParams {
  onSuccess?: (response: GetUserResponse) => void;
  onError?: (error: string) => void;
}

export function useGetUser({ onSuccess, onError }: UseGetUserParams = {}) {
  const { execute, loading, data } = useCall<GetUserResponse, GetUserParams>({
    fn: getUser,
    onSuccess,
    onError,
  });

  return {
    callGetUser: execute,
    isLoading: loading,
    user: data?.data ?? null,
  };
}

// ============================================================================
// Create User
// ============================================================================

export interface UseCreateUserParams {
  onSuccess?: (response: CreateUserResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateUser({
  onSuccess,
  onError,
}: UseCreateUserParams = {}) {
  const { execute, loading } = useCall<CreateUserResponse, CreateUserParams>({
    fn: createUser,
    onSuccess,
    onError,
  });

  return {
    callCreateUser: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Update Profile
// ============================================================================

export interface UseUpdateProfileParams {
  onSuccess?: (response: UpdateProfileResponse) => void;
  onError?: (error: string) => void;
}

export function useUpdateProfile({
  onSuccess,
  onError,
}: UseUpdateProfileParams = {}) {
  const { execute, loading } = useCall<
    UpdateProfileResponse,
    UpdateProfileParams
  >({
    fn: updateProfile,
    onSuccess,
    onError,
  });

  return {
    callUpdateProfile: execute,
    isLoading: loading,
  };
}

// ============================================================================
// Delete User
// ============================================================================

export interface UseDeleteUserParams {
  onSuccess?: (response: DeleteUserResponse) => void;
  onError?: (error: string) => void;
}

export function useDeleteUser({
  onSuccess,
  onError,
}: UseDeleteUserParams = {}) {
  const { execute, loading } = useCall<DeleteUserResponse, DeleteUserParams>({
    fn: deleteUser,
    onSuccess,
    onError,
  });

  return {
    callDeleteUser: execute,
    isLoading: loading,
  };
}
