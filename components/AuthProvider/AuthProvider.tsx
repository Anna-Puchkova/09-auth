"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const isSessionValid = await checkSession();

        if (!isSessionValid) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        if (isMounted) {
          setUser(user);
        }
      } catch (error) {
        clearIsAuthenticated();
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
