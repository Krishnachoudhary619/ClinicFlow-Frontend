import { apiRequest } from "../api";
import { ENDPOINTS } from "../endpoints";
import { PublicClinicResponse, PublicTokenResponse } from "@/types/queue";

export const getPublicClinic = (slug: string) =>
    apiRequest<PublicClinicResponse>("get", ENDPOINTS.PUBLIC.CLINIC(slug));

export const generatePublicToken = (payload: {
    clinicId: number;
    patientName: string;
    patientPhone?: string;
}) =>
    apiRequest<PublicTokenResponse>("post", ENDPOINTS.PUBLIC.GENERATE_TOKEN, payload);

export const trackPublicToken = (code: string) =>
    apiRequest<PublicTokenResponse>("get", ENDPOINTS.PUBLIC.TRACK_TOKEN(code));
