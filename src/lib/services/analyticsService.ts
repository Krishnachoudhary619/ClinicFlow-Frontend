import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

export async function fetchTodayAnalytics() {
    return apiRequest<any>("get", ENDPOINTS.ANALYTICS.TODAY);
}

export async function fetchHourlyAnalytics(date: string) {
    return apiRequest<any>(
        "get",
        `${ENDPOINTS.ANALYTICS.HOURLY}?date=${date}`
    );
}

export async function fetchHistoryAnalytics(days = 7) {
    return apiRequest<any>(
        "get",
        `${ENDPOINTS.ANALYTICS.HISTORY}?days=${days}`
    );
}
