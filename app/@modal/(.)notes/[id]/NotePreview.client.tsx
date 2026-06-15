"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";
import { fetchNoteById } from "@/lib/api/clientApi";

export default function NotePreview() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}

        {note && (
          <>
            <h2>{note.title}</h2>
            <p>{note.tag}</p>
            <p>{note.content}</p>
            <p>{new Date(note.createdAt).toLocaleDateString()}</p>
          </>
        )}
      </div>
    </Modal>
  );
}
