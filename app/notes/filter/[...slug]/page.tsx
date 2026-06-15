import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { NoteTag } from "@/types/note";
import type { Metadata } from "next";

type Params = {
  slug: string[];
};

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

function parseTag(slug?: string): NoteTag | undefined {
  if (!slug || slug === "all") return undefined;
  return TAGS.includes(slug as NoteTag) ? (slug as NoteTag) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  const slugValue = slug?.[0];
  const tag = parseTag(slugValue);

  const title = tag ? `${tag} notes` : "All notes";
  const description = tag
    ? `Showing notes filtered by ${tag}`
    : "Showing all notes";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://07-routing-nextjs-five-ruby.vercel.app/notes/filter/${
        slugValue ?? "all"
      }`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const tag = parseTag(slug?.[0]);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
