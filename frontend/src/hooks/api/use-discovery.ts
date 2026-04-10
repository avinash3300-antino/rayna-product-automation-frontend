"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformDiscoveryRunResponse,
  transformScrapeSourceResponse,
} from "@/lib/transformers";
import type {
  BackendSourceDiscoveryRunResponse,
  BackendScrapeSourceResponse,
} from "@/types/api-responses";
import type { DiscoveryRun, ScrapeSource } from "@/types/discovery";

export function useTriggerDiscovery() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    DiscoveryRun,
    Error,
    { city_id: string; category: string }
  >({
    mutationFn: async (body) => {
      const raw = await api.post<BackendSourceDiscoveryRunResponse>(
        "/api/v1/discovery/run",
        body
      );
      return transformDiscoveryRunResponse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discovery.all });
    },
  });
}

export function useDiscoveryRun(runId: string | null) {
  const api = useApiClient();

  return useQuery<DiscoveryRun>({
    queryKey: queryKeys.discovery.run(runId ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendSourceDiscoveryRunResponse>(
        `/api/v1/discovery/runs/${runId}`
      );
      return transformDiscoveryRunResponse(raw);
    },
    enabled: !!runId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === "pending" || data.status === "running")) {
        return 3000;
      }
      return false;
    },
  });
}

export function useDiscoverySources(runId: string | null) {
  const api = useApiClient();

  return useQuery<ScrapeSource[]>({
    queryKey: queryKeys.discovery.sources(runId ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendScrapeSourceResponse[]>(
        `/api/v1/discovery/runs/${runId}/sources`
      );
      return raw.map(transformScrapeSourceResponse);
    },
    enabled: !!runId,
  });
}

export function useApproveSources() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    ScrapeSource[],
    Error,
    { runId: string; source_ids: string[]; approved: boolean }
  >({
    mutationFn: async ({ runId, source_ids, approved }) => {
      const raw = await api.post<BackendScrapeSourceResponse[]>(
        `/api/v1/discovery/runs/${runId}/approve-sources`,
        { source_ids, approved }
      );
      return raw.map(transformScrapeSourceResponse);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.discovery.sources(variables.runId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.discovery.run(variables.runId),
      });
    },
  });
}

export function useAddManualSource() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    ScrapeSource,
    Error,
    {
      runId: string;
      source_name: string;
      source_url: string;
      tier: number;
    }
  >({
    mutationFn: async ({ runId, ...body }) => {
      const raw = await api.post<BackendScrapeSourceResponse>(
        `/api/v1/discovery/runs/${runId}/add-source`,
        body
      );
      return transformScrapeSourceResponse(raw);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.discovery.sources(variables.runId),
      });
    },
  });
}
