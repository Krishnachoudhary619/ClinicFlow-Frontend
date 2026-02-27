import { create } from "zustand";
import { UserProfile } from "@/types/user";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserProfile | null;
    isAuthenticated: boolean;
    isInitialized: boolean;

    setTokens: (access: string, refresh: string) => void;
    setUser: (user: UserProfile) => void;
    logout: () => void;
    initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
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

    setUser: (user) => {
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
        });
    },
}));
