"use client";

import { use } from "react";
import { BatchDetailPage } from "@/components/push-history/batch-detail-page";

export default function BatchDetailRoute({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = use(params);
  return <BatchDetailPage batchId={batchId} />;
}
