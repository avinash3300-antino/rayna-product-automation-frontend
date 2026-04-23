"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformCruiseCardResponse,
  transformCruiseResponse,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendCruiseCard,
  BackendCruiseResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { CruiseCardItem, Cruise } from "@/types/cruises";
import type { PaginatedResponse } from "@/types/index";

interface ListCruisesParams {
  search?: string;
  sub_category?: string;
  cruise_type?: string;
  vessel_type?: string;
  status?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  meal_included?: boolean;
  page?: number;
  perPage?: number;
}

export function useCruiseCities() {
  const api = useApiClient();

  return useQuery<string[]>({
    queryKey: queryKeys.cruises.cities,
    queryFn: async () => {
      return api.get<string[]>("/api/v1/cruises/cities");
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCruises(params: ListCruisesParams = {}) {
  const api = useApiClient();

  return useQuery<PaginatedResponse<CruiseCardItem>>({
    queryKey: queryKeys.cruises.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.sub_category) searchParams.set("sub_category", params.sub_category);
      if (params.cruise_type) searchParams.set("cruise_type", params.cruise_type);
      if (params.vessel_type) searchParams.set("vessel_type", params.vessel_type);
      if (params.status) searchParams.set("status", params.status);
      if (params.city) searchParams.set("city", params.city);
      if (params.min_price != null) searchParams.set("min_price", String(params.min_price));
      if (params.max_price != null) searchParams.set("max_price", String(params.max_price));
      if (params.meal_included != null) searchParams.set("meal_included", String(params.meal_included));
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));

      const qs = searchParams.toString();
      const raw = await api.get<BackendPaginatedResponse<BackendCruiseCard>>(
        `/api/v1/cruises${qs ? `?${qs}` : ""}`
      );
      return transformPaginatedResponse(raw, transformCruiseCardResponse);
    },
  });
}

export function useCruise(id: string | null) {
  const api = useApiClient();

  return useQuery<Cruise>({
    queryKey: queryKeys.cruises.detail(id ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendCruiseResponse>(
        `/api/v1/cruises/${id}`
      );
      return transformCruiseResponse(raw);
    },
    enabled: !!id,
  });
}

export function useUpdateCruise() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cruiseId,
      data,
    }: {
      cruiseId: string;
      data: Record<string, unknown>;
    }) => {
      return api.patch(`/api/v1/cruises/${cruiseId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cruises.all });
    },
  });
}

export function useUpdateCruiseStatus() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cruiseId,
      status,
    }: {
      cruiseId: string;
      status: string;
    }) => {
      return api.patch(`/api/v1/cruises/${cruiseId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cruises.all });
    },
  });
}

export function useDeleteCruise() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cruiseId: string) => {
      return api.delete(`/api/v1/cruises/${cruiseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cruises.all });
    },
  });
}

export function useReEnrichCruise() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cruiseId: string) => {
      const raw = await api.post<BackendCruiseResponse>(
        `/api/v1/cruises/${cruiseId}/re-enrich`,
        {}
      );
      return transformCruiseResponse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cruises.all });
    },
  });
}
