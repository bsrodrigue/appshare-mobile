import { useState, useCallback } from "react";
import { AxiosRequestConfig, AxiosError } from "axios";
import { APIService } from "@/libs/api/client";
import { ApiResponse, ErrorModel } from "@/types/api";
import * as Haptics from "expo-haptics";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorModel | null;
}

interface UseApiResult<T, P = any> extends UseApiState<T> {
  execute: (
    params?: P,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T> | undefined>;
  reset: () => void;
}

// Generic hook creator for API methods
function useApiMethod<T, P = any>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
): UseApiResult<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (params?: P, config?: AxiosRequestConfig) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const client = APIService.getClient();
        let response: ApiResponse<T>;

        switch (method) {
          case "get":
            response = await client.get<T>(url, { ...config, params });
            break;
          case "post":
            response = await client.post<T>(url, params, config);
            break;
          case "put":
            response = await client.put<T>(url, params, config);
            break;
          case "delete":
            response = await client.delete<T>(url, config);
            break;
          case "patch":
            response = await client.patch<T>(url, params, config);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setState({ data: response.data, loading: false, error: null });
        return response;
      } catch (err) {
        const error = err as AxiosError<ErrorModel>;
        const apiError: ErrorModel = error.response?.data || {
          type: "about:blank",
          detail: error.message || "An unexpected error occurred",
          title: "Error",
          status: error.response?.status,
        };
        setState((prev) => ({ ...prev, loading: false, error: apiError }));
        throw err;
      }
    },
    [method, url],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

export function useGet<T, P = any>(url: string) {
  return useApiMethod<T, P>("get", url);
}

export function usePost<T, P = any>(url: string) {
  return useApiMethod<T, P>("post", url);
}

export function usePut<T, P = any>(url: string) {
  return useApiMethod<T, P>("put", url);
}

export function useDelete<T, P = any>(url: string) {
  return useApiMethod<T, P>("delete", url);
}

export function usePatch<T, P = any>(url: string) {
  return useApiMethod<T, P>("patch", url);
}

interface UseCallParams<T, P> {
  fn: (params: P) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseCallResult<T, P> {
  execute: (params: P) => Promise<T | null>;
  loading: boolean;
  data: T | null;
  error: string | null;
}

export function useCall<T, P>({
  fn,
  onSuccess,
  onError,
}: UseCallParams<T, P>): UseCallResult<T, P> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fn(params);
        setData(response);
        if (onSuccess) {
          onSuccess(response);
        }
        return response;
      } catch (err) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        let errorMessage = "An unexpected error occurred";
        if (err instanceof AxiosError) {
          const apiError = err.response?.data as ErrorModel;
          errorMessage = apiError?.detail || apiError?.title || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message ?? "An unexpected error occurred";
        }

        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn, onSuccess, onError],
  );

  return {
    execute,
    loading,
    data,
    error,
  };
}
