"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformDestinationResponse,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendDestinationListItem,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { Destination, DestinationStatus } from "@/types/destinations";
import type { PaginatedResponse } from "@/types/index";

interface ListDestinationsParams {
  search?: string;
  status?: DestinationStatus;
  country_code?: string;
  page?: number;
  perPage?: number;
}

export function useDestinations(params: ListDestinationsParams = {}) {
  const api = useApiClient();

  return useQuery<PaginatedResponse<Destination>>({
    queryKey: queryKeys.destinations.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set("search", params.search);
      if (params.status) searchParams.set("status", params.status);
      if (params.country_code)
        searchParams.set("country_code", params.country_code);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));

      const qs = searchParams.toString();
      const raw = await api.get<
        BackendPaginatedResponse<BackendDestinationListItem>
      >(`/api/v1/destinations${qs ? `?${qs}` : ""}`);
      return transformPaginatedResponse(raw, transformDestinationResponse);
    },
  });
}

interface CreateDestinationPayload {
  name: string;
  country_name: string;
  country_flag: string;
  city_name: string;
  enabled_categories: string[];
}

export function useCreateDestination() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDestinationPayload) => {
      return api.post("/api/v1/destinations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all });
    },
  });
}

interface UpdateDestinationPayload {
  name?: string;
  country_name?: string;
  country_flag?: string;
  city_name?: string;
  enabled_categories?: string[];
}

export function useUpdateDestination() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      destinationId,
      data,
    }: {
      destinationId: string;
      data: UpdateDestinationPayload;
    }) => {
      return api.patch(`/api/v1/destinations/${destinationId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all });
    },
  });
}

export function useDeleteDestination() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationId: string) => {
      return api.delete(`/api/v1/destinations/${destinationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all });
    },
  });
}

export function useUpdateDestinationStatus() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      destinationId,
      status,
    }: {
      destinationId: string;
      status: string;
    }) => {
      return api.patch(`/api/v1/destinations/${destinationId}/status`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all });
    },
  });
}
