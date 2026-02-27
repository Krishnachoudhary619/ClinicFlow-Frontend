import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;

    setTokens: (access: string, refresh: string) => void;
    logout: () => void;
    initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isInitialized: false,

    initialize: () => {
        if (typeof window !== "undefined") {
            const access = localStorage.getItem("accessToken");
            const refresh = localStorage.getItem("refreshToken");

            if (access && refresh) {
                set({
                    accessToken: access,
                    refreshToken: refresh,
                    isAuthenticated: true,
                    isInitialized: true,
                });
            } else {
                set({ isInitialized: true });
            }
        }
    },

    setTokens: (access, refresh) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        set({
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },
}));
