export type TokenStatus =
    | "WAITING"
    | "CALLED"
    | "SERVED"
    | "DELAYED";

export interface Token {
    id: number;
    tokenNumber: number;
    cycleNumber: number;
    status: TokenStatus;
}

export interface QueueResponse {
    currentServing: Token | null;
    waitingCount: number;
    waitingTokens: Token[];
}
