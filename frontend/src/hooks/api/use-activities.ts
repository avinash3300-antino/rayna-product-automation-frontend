"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformActivityCardResponse,
  transformActivityResponse,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendActivityCard,
  BackendActivityResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { ActivityCardItem, Activity } from "@/types/activities";
import type { PaginatedResponse } from "@/types/index";

interface ListActivitiesParams {
  search?: string;
  category?: string;
  status?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  free_cancellation?: boolean;
  instant_confirmation?: boolean;
  page?: number;
  perPage?: number;
}

export function useActivities(params: ListActivitiesParams = {}) {
  const api = useApiClient();

  return useQuery<PaginatedResponse<ActivityCardItem>>({
    queryKey: queryKeys.activities.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.category) searchParams.set("category", params.category);
      if (params.status) searchParams.set("status", params.status);
      if (params.city) searchParams.set("city", params.city);
      if (params.min_price != null)
        searchParams.set("min_price", String(params.min_price));
      if (params.max_price != null)
        searchParams.set("max_price", String(params.max_price));
      if (params.free_cancellation != null)
        searchParams.set("free_cancellation", String(params.free_cancellation));
      if (params.instant_confirmation != null)
        searchParams.set(
          "instant_confirmation",
          String(params.instant_confirmation)
        );
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));

      const qs = searchParams.toString();
      const raw = await api.get<BackendPaginatedResponse<BackendActivityCard>>(
        `/api/v1/activities${qs ? `?${qs}` : ""}`
      );
      return transformPaginatedResponse(raw, transformActivityCardResponse);
    },
  });
}

export function useActivity(id: string | null) {
  const api = useApiClient();

  return useQuery<Activity>({
    queryKey: queryKeys.activities.detail(id ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendActivityResponse>(
        `/api/v1/activities/${id}`
      );
      return transformActivityResponse(raw);
    },
    enabled: !!id,
  });
}

export function useUpdateActivity() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      data,
    }: {
      activityId: string;
      data: Record<string, unknown>;
    }) => {
      return api.patch(`/api/v1/activities/${activityId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useUpdateActivityStatus() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      status,
    }: {
      activityId: string;
      status: string;
    }) => {
      return api.patch(`/api/v1/activities/${activityId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useDeleteActivity() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      return api.delete(`/api/v1/activities/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}

export function useReEnrichActivity() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const raw = await api.post<BackendActivityResponse>(
        `/api/v1/activities/${activityId}/re-enrich`,
        {}
      );
      return transformActivityResponse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
  });
}
