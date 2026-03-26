"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformUserResponse,
  transformAuditLogToActivity,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendUserResponse,
  BackendAuditLogResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { AppUser } from "@/types/users";

export function useCurrentUser() {
  const { status } = useSession();
  const api = useApiClient();

  return useQuery<AppUser>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const raw = await api.get<BackendUserResponse>("/api/v1/auth/me");
      return transformUserResponse(raw);
    },
    enabled: status === "authenticated",
  });
}

export function useUpdateProfile() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      full_name?: string;
      job_title?: string;
      department?: string;
      phone?: string;
      timezone?: string;
    }) => {
      const raw = await api.patch<BackendUserResponse>(
        "/api/v1/users/me/profile",
        data
      );
      return transformUserResponse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useChangePassword() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => {
      await api.patch("/api/v1/users/me/password", data);
    },
  });
}

interface ActivityParams {
  actionType?: string;
  page?: number;
  perPage?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useMyActivity(params: ActivityParams = {}) {
  const api = useApiClient();

  return useQuery({
    queryKey: queryKeys.profile.activity(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.actionType)
        searchParams.set("action_type", params.actionType);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));
      if (params.dateFrom) searchParams.set("date_from", params.dateFrom);
      if (params.dateTo) searchParams.set("date_to", params.dateTo);

      const qs = searchParams.toString();
      const raw = await api.get<
        BackendPaginatedResponse<BackendAuditLogResponse>
      >(`/api/v1/users/me/activity${qs ? `?${qs}` : ""}`);
      return transformPaginatedResponse(raw, transformAuditLogToActivity);
    },
  });
}
