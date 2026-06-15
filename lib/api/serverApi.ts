import { cookies } from "next/headers";
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

const getCookieConfig = async () => {
  const cookieStore = await cookies();

  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async ({
  page,
  search,
  tag,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const config = await getCookieConfig();

  const { data } = await api.get("/notes", {
    ...config,
    params: {
      page,
      search,
      tag,
      perPage,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getCookieConfig();

  const { data } = await api.get(`/notes/${id}`, config);

  return data;
};

export const checkSession = async () => {
  const config = await getCookieConfig();

  const response = await api.get("/auth/session", config);

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const config = await getCookieConfig();

  const { data } = await api.get("/users/me", config);

  return data;
};
