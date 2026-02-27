import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export async function refreshService(refreshToken: string) {
    return apiRequest<RefreshResponse>(
        "post",
        ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
    );
}
