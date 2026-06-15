"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
