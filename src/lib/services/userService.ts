import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { UserProfile } from "@/types/user";

export async function fetchProfile() {
    return apiRequest<UserProfile>(
        "get",
        ENDPOINTS.AUTH.ME
    );
}
