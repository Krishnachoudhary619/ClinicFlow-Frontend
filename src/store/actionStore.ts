import { create } from "zustand";

type ActionState = {
    activeAction: string | null;
    startAction: (name: string) => void;
    endAction: () => void;
    isLocked: (name?: string) => boolean;
};

export const useActionStore = create<ActionState>((set, get) => ({
    activeAction: null,

    startAction: (name) => {
        if (!get().activeAction) {
            set({ activeAction: name });
        }
    },

    endAction: () => {
        set({ activeAction: null });
    },

    isLocked: (name) => {
        if (!name) return !!get().activeAction;
        return get().activeAction === name;
    },
}));
