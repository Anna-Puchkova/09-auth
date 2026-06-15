import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: NoteTag;
  perPage?: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username?: string;
  avatar?: string;
};

type SessionResponse = {
  success: boolean;
  user?: User;
};

export const fetchNotes = async ({
  page,
  search,
  tag,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search?.trim()) params.search = search;
  if (tag) params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
};

export const register = async (payload: RegisterRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get<SessionResponse>("/auth/session");
  return data.success;
};

export const getMe = async () => {
  const { data } = await api.get("/users/me", {
    withCredentials: true,
  });

  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
};
