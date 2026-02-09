// Shared types used across multiple features

export type Pagination = {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export type ApiSuccessResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
}

export type ApiErrorResponse = {
    success: boolean;
    message: string;
    error_code?: string;
}

export type ValidationErrorResponse = {
    message: string;
    errors: Record<string, string[]>;
}
