import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { Logger } from '../log';
import { JSONService } from '../json';
import { SecureStorage } from '../secure-storage';
import { SecureStorageKey } from '../secure-storage/keys';

export interface APIResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export type APIError = {
    errors: Array<object>;
    message: string;
}

export class HTTPClient {
    private instance: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        const logStr = `HTTPClient Constructor: \n\tBASE_URL: ${baseURL}`;

        Logger.setModuleName('HTTPClient');
        Logger.debug(logStr);

        this.instance = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            ...config,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                Logger.setModuleName('HTTPClient');

                const reqString = `${config.method} ${config.url} ${JSONService.stringify(config.data) ?? ""}`;

                Logger.debug(`Request: ${reqString}`);

                try {

                    const token = await SecureStorage.getItem(SecureStorageKey.BEARER_TOKEN);

                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }

                } catch (error) {
                    Logger.error(`Failed to load token: ${error}`);
                }

                return config;
            },

            (error: AxiosError) => {
                Logger.error(`Request Error: ${JSON.stringify(error)}`);
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                Logger.setModuleName('HTTPClient');
                Logger.debug(`Response: ${JSONService.stringify(response.data)}`);
                return response;
            },

            async (error: AxiosError) => {
                if (error.response) {

                    if (error.response.status === 401) {
                        // Absent token maybe?
                        const token = await SecureStorage.getItem(SecureStorageKey.BEARER_TOKEN);

                        if (!token) {
                            return Promise.reject(error);
                        }
                    }

                    if (error.response.status === 500) {
                    }

                    const apiError = error.response.data as APIError;

                    const errorString = `
                        Status: ${error.response.status}
                        Code: ${error.code}
                        Message: ${apiError.message}
                        Errors: ${apiError.errors}
                    `;

                    Logger.error(errorString);

                } else if (error.request) {
                    Logger.error(`Request Error Request: ${JSON.stringify(error)}`);
                } else {
                    Logger.error(`Request Error: ${JSON.stringify(error)}`);
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        const response = await this.instance.get<T>(url, config);

        return this.handleResponse(response);
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        const response = await this.instance.post<T>(url, data, config);

        return this.handleResponse(response);
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        const response = await this.instance.put<T>(url, data, config);

        return this.handleResponse(response);
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        const response = await this.instance.patch<T>(url, data, config);

        return this.handleResponse(response);
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
        const response = await this.instance.delete<T>(url, config);

        return this.handleResponse(response);
    }

    // --- Response Formatting Helper ---

    private handleResponse<T>(response: AxiosResponse<T>): APIResponse<T> {

        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }
}