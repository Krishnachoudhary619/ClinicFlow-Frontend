import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { QueueResponse } from "@/types/queue";

export async function fetchCurrentQueue() {
    return apiRequest<QueueResponse>(
        "get",
        ENDPOINTS.QUEUE.CURRENT
    );
}

export async function generateToken(payload: {
    patientName: string;
    patientPhone: string;
}) {
    return apiRequest<any>(
        "post",
        ENDPOINTS.QUEUE.GENERATE,
        payload
    );
}

export async function serveNext() {
    return apiRequest<any>(
        "post",
        ENDPOINTS.QUEUE.SERVE_NEXT
    );
}

export async function skipToken() {
    return apiRequest<any>(
        "post",
        ENDPOINTS.QUEUE.SKIP
    );
}

export async function resetTokens() {
    return apiRequest<any>(
        "post",
        ENDPOINTS.QUEUE.RESET
    );
}

export async function startNewDay() {
    return apiRequest<any>(
        "post",
        ENDPOINTS.QUEUE.START_NEW_DAY
    );
}
