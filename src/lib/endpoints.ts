export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REFRESH: "/auth/refresh",
        ME: "/auth/me",
    },

    QUEUE: {
        CURRENT: "/queue/current",
        GENERATE: "/queue/token",
        SERVE_NEXT: "/queue/serve-next",
        SKIP: "/queue/skip",
        RESET: "/queue/reset",
        START_NEW_DAY: "/queue/start-new-day",
    },

    PUBLIC: {
        TOKEN: (tokenId: number | string) =>
            `/public/token/${tokenId}`,
    },

    ANALYTICS: {
        TODAY: "/analytics/today",
        HOURLY: "/analytics/hourly",
        HISTORY: "/analytics/history",
    },
};
