import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

type Store = {
  draft: Draft;
  setDraft: (data: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<Store>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (data) =>
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    },
  ),
);
