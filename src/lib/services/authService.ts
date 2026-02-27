import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { LoginRequest, LoginResponse } from "@/types/auth";

export async function loginService(
    payload: LoginRequest
) {
    return apiRequest<LoginResponse>(
        "post",
        ENDPOINTS.AUTH.LOGIN,
        payload
    );
}
