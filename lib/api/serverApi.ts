import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: string;
  perPage?: number;
}

export const fetchNotes = async ({
  page,
  search,
  tag,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get("/notes", {
    params: { page, search, tag, perPage },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get("/auth/session");
  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get("/users/me");
  return data;
};
