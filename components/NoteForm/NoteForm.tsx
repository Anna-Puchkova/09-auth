"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = (formData: FormData) => {
    const payload: {
      title: string;
      content: string;
      tag: NoteTag;
    } = {
      title: String(formData.get("title") || ""),
      content: String(formData.get("content") || ""),
      tag: formData.get("tag") as NoteTag,
    };

    mutation.mutate(payload);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input
          name="title"
          defaultValue={draft.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDraft({ title: e.target.value })
          }
          className={css.input}
        />
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea
          name="content"
          defaultValue={draft.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDraft({ content: e.target.value })
          }
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select
          name="tag"
          defaultValue={draft.tag}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDraft({ tag: e.target.value as NoteTag })
          }
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={css.cancelButton}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
