import { useState, useCallback } from 'react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { APIService } from '@/libs/api/client';
import { APIResponse, APIError } from '@/libs/http/client';
import * as Haptics from 'expo-haptics';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: APIError | null;
}

interface UseApiResult<T, P = any> extends UseApiState<T> {
    execute: (params?: P, config?: AxiosRequestConfig) => Promise<APIResponse<T> | undefined>;
    reset: () => void;
}

// Generic hook creator for API methods
function useApiMethod<T, P = any>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string
): UseApiResult<T, P> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (params?: P, config?: AxiosRequestConfig) => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const client = APIService.getClient();
            let response: APIResponse<T>;

            switch (method) {
                case 'get':
                    response = await client.get<T>(url, { ...config, params });
                    break;
                case 'post':
                    response = await client.post<T>(url, params, config);
                    break;
                case 'put':
                    response = await client.put<T>(url, params, config);
                    break;
                case 'delete':
                    response = await client.delete<T>(url, config);
                    break;
                case 'patch':
                    response = await client.patch<T>(url, params, config);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            setState({ data: response.data, loading: false, error: null });
            return response;
        } catch (err) {
            const error = err as AxiosError<APIError>;
            const apiError: APIError = error.response?.data || {
                message: error.message || 'An unexpected error occurred',
                errors: [],
            };
            setState((prev) => ({ ...prev, loading: false, error: apiError }));
            throw err; // Re-throw to allow caller to handle if needed
        }
    }, [method, url]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, execute, reset };
}

export function useGet<T, P = any>(url: string) {
    return useApiMethod<T, P>('get', url);
}

export function usePost<T, P = any>(url: string) {
    return useApiMethod<T, P>('post', url);
}

export function usePut<T, P = any>(url: string) {
    return useApiMethod<T, P>('put', url);
}

export function useDelete<T, P = any>(url: string) {
    return useApiMethod<T, P>('delete', url);
}

export function usePatch<T, P = any>(url: string) {
    return useApiMethod<T, P>('patch', url);
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

    const execute = async (params: P) => {
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

            let errorMessage = 'An unexpected error occurred';
            if (err instanceof AxiosError) {
                const apiError = err.response?.data as APIError;
                errorMessage = apiError?.message || err.message;
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
    };

    return {
        execute,
        loading,
        data,
        error,
    };
}