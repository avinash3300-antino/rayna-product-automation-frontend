"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useApiClient } from "./use-api-client";

export function useLogout() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/api/v1/auth/logout");
      } catch {
        // Even if backend logout fails, proceed with client-side signout
      }
    },
    onSettled: () => {
      signOut({ callbackUrl: "/login" });
    },
  });
}
