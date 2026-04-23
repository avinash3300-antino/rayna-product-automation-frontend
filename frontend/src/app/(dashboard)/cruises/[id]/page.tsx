"use client";

import { use } from "react";
import { CruiseDetail } from "@/components/cruises/cruise-detail";

export default function CruiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CruiseDetail cruiseId={id} />;
}
