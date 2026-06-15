"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import { fetchNotes } from "@/lib/api";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

import type { NoteTag } from "@/types/note";
import css from "./NotesPage.module.css";

type Props = {
  tag?: NoteTag;
};

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search,
        tag,
      }),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.left}>
          <SearchBox onSearch={handleSearch} />
        </div>

        <div className={css.center}>
          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </div>

        <div className={css.right}>
          <Link href="/notes/action/create">+ Create note</Link>
        </div>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
