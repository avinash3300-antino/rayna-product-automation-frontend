"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import type { DashboardStats } from "@/types/dashboard";

export function useDashboardStats() {
  const api = useApiClient();

  return useQuery<DashboardStats>({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => api.get<DashboardStats>("/api/v1/dashboard/stats"),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // auto-refresh every 60s
  });
}
