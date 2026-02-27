export interface ApiError {
    code: string;
    details: any;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error: ApiError | null;
}
