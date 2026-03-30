"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import type { ActiveSession } from "@/types/profile";

export function useSessions() {
  const { status } = useSession();
  const api = useApiClient();

  return useQuery<ActiveSession[]>({
    queryKey: queryKeys.sessions.all,
    queryFn: () => api.get<ActiveSession[]>("/api/v1/users/me/sessions"),
    enabled: status === "authenticated",
  });
}

export function useRevokeSession() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      api.delete(`/api/v1/users/me/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}

export function useRevokeAllSessions() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete("/api/v1/users/me/sessions"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
}
