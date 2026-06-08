"use client";

import { useEffect, ReactNode } from "react";
import { useSession } from "@/lib/auth/client";
import { useAuthStore } from "@/lib/stores/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Syncs BetterAuth session with Zustand authStore
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const session = useSession();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    if (session.isPending) {
      setLoading(true);
      return;
    }

    if (session.data?.user) {
      setUser(session.data.user);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session.data?.user, session.isPending, setUser, setLoading]);

  return <>{children}</>;
}
