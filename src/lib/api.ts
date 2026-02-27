import axios from "axios";
import { ApiResponse } from "@/types/api";
import { refreshService } from "@/lib/services/refreshService";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for auto refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken =
                localStorage.getItem("refreshToken");

            if (!refreshToken) {
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            const refreshResponse =
                await refreshService(refreshToken);

            if (refreshResponse.success && refreshResponse.data) {
                const { accessToken, refreshToken: newRefresh } =
                    refreshResponse.data;

                useAuthStore
                    .getState()
                    .setTokens(accessToken, newRefresh);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);
            } else {
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// Generic wrapper
export async function apiRequest<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any
): Promise<ApiResponse<T>> {
    try {
        const response = await api({
            method,
            url,
            data,
        });

        return response.data as ApiResponse<T>;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data as ApiResponse<T>;
        }

        return {
            success: false,
            message: "Network error",
            data: null,
            error: {
                code: "NETWORK_ERROR",
                details: null,
            },
        };
    }
}

export default api;