export type TokenStatus =
    | "WAITING"
    | "CALLED"
    | "SERVED"
    | "DELAYED"
    | "EXPIRED";

export interface Token {
    id: number;
    tokenNumber: number;
    cycleNumber: number;
    status: TokenStatus;
    patientName?: string;
    patientPhone?: string;
    publicTokenCode: string;
    source: "RECEPTION" | "SELF_SERVICE";
}

export interface QueueResponse {
    currentServing: Token | null;
    waitingCount: number;
    waitingTokens: Token[];
}

export interface PublicClinicResponse {
    clinicId: number;
    name: string;
    address: string;
    isQueueOpen: boolean;
    currentServing: number | null;
    waitingCount: number;
}

export interface PublicTokenResponse {
    tokenNumber: number;
    publicTokenCode: string;
    status: string;
    currentServing: number | null;
    waitingBeforeYou: number;
    estimatedWaitMinutes: number;
    clinicName: string;
    isActive: boolean;
}

