import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
    initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isAuthenticated: false,

    initialize: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                set({
                    accessToken: token,
                    isAuthenticated: true,
                });
            }
        }
    },

    setToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({
            accessToken: token,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        set({
            accessToken: null,
            isAuthenticated: false,
        });
    },
}));
