"use client";

import { use } from "react";
import { ActivityDetail } from "@/components/activities/activity-detail";

export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ActivityDetail activityId={id} />;
}
