"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformUserResponse,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendUserResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { AppUser, UserRole, UserStatus } from "@/types/users";
import type { PaginatedResponse } from "@/types/index";

interface ListUsersParams {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  page?: number;
  perPage?: number;
}

export function useUsers(params: ListUsersParams = {}) {
  const api = useApiClient();

  return useQuery<PaginatedResponse<AppUser>>({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.status) searchParams.set("status", params.status);
      if (params.role) searchParams.set("role", params.role);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));

      const qs = searchParams.toString();
      const raw = await api.get<BackendPaginatedResponse<BackendUserResponse>>(
        `/api/v1/users${qs ? `?${qs}` : ""}`
      );
      return transformPaginatedResponse(raw, transformUserResponse);
    },
  });
}

export function useUser(userId: string) {
  const api = useApiClient();

  return useQuery<AppUser>({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const raw = await api.get<BackendUserResponse>(
        `/api/v1/users/${userId}`
      );
      return transformUserResponse(raw);
    },
    enabled: !!userId,
  });
}

export function useInviteUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      full_name: string;
      email: string;
      roles?: string[];
    }) => {
      const raw = await api.post<BackendUserResponse>(
        "/api/v1/users/invite",
        data
      );
      return transformUserResponse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: {
        full_name?: string;
        job_title?: string;
        status?: string;
        roles?: string[];
      };
    }) => {
      const raw = await api.patch<BackendUserResponse>(
        `/api/v1/users/${userId}`,
        data
      );
      return transformUserResponse(raw);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
    },
  });
}

export function useResetUserPassword() {
  const api = useApiClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.patch(`/api/v1/users/${userId}/password-reset`, {});
    },
  });
}
