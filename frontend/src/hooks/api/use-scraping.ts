"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import {
  transformScrapeJobResponse,
  transformPaginatedResponse,
} from "@/lib/transformers";
import type {
  BackendScrapeJobResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
import type { ScrapeJob } from "@/types/scraping";
import type { PaginatedResponse } from "@/types/index";

interface ListScrapeJobsParams {
  city_id?: string;
  category?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export function useScrapeJobs(params: ListScrapeJobsParams = {}) {
  const api = useApiClient();

  return useQuery<PaginatedResponse<ScrapeJob>>({
    queryKey: queryKeys.scraping.jobs(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.city_id) searchParams.set("city_id", params.city_id);
      if (params.category) searchParams.set("category", params.category);
      if (params.status) searchParams.set("status", params.status);
      if (params.page) searchParams.set("page", String(params.page));
      if (params.perPage) searchParams.set("per_page", String(params.perPage));

      const qs = searchParams.toString();
      const raw = await api.get<BackendPaginatedResponse<BackendScrapeJobResponse>>(
        `/api/v1/scraping/jobs${qs ? `?${qs}` : ""}`
      );
      return transformPaginatedResponse(raw, transformScrapeJobResponse);
    },
  });
}

export function useScrapeJob(jobId: string | null) {
  const api = useApiClient();

  return useQuery<ScrapeJob>({
    queryKey: queryKeys.scraping.job(jobId ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendScrapeJobResponse>(
        `/api/v1/scraping/jobs/${jobId}`
      );
      return transformScrapeJobResponse(raw);
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (
        data &&
        (data.status === "pending" ||
          data.status === "scraping" ||
          data.status === "extracting" ||
          data.status === "saving" ||
          data.status === "enriching")
      ) {
        return 3000;
      }
      return false;
    },
  });
}

export function useTriggerScraping() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    ScrapeJob[],
    Error,
    { discovery_run_id: string; category: string }
  >({
    mutationFn: async (body) => {
      const raw = await api.post<BackendScrapeJobResponse[]>(
        "/api/v1/scraping/run",
        body
      );
      return raw.map(transformScrapeJobResponse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scraping.all });
    },
  });
}
