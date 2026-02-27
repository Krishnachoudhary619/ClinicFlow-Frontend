import axios from "axios";
import { ApiResponse } from "@/types/api";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach access token
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Generic request wrapper
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