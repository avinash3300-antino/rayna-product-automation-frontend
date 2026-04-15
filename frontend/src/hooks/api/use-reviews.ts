"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { queryKeys } from "./query-keys";
import { transformReviewListResponse } from "@/lib/transformers";
import type { BackendReviewListResponse } from "@/types/api-responses";
import type { ActivityReviewList } from "@/types/activities";

export function useActivityReviews(activityId: string | null) {
  const api = useApiClient();

  return useQuery<ActivityReviewList>({
    queryKey: queryKeys.activities.reviews(activityId ?? ""),
    queryFn: async () => {
      const raw = await api.get<BackendReviewListResponse>(
        `/api/v1/activities/${activityId}/reviews`
      );
      return transformReviewListResponse(raw);
    },
    enabled: !!activityId,
  });
}

export function useScrapeReviews() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activityId,
      platforms,
    }: {
      activityId: string;
      platforms?: string[];
    }) => {
      return api.post(`/api/v1/activities/${activityId}/reviews/scrape`, {
        platforms: platforms ?? null,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.reviews(variables.activityId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.detail(variables.activityId),
      });
    },
  });
}
