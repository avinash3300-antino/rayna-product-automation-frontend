"use client";

import { use } from "react";
import { ScrapeJobDetail } from "@/components/scraping/scrape-job-detail";

export default function ScrapeJobDetailRoute({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  return <ScrapeJobDetail jobId={jobId} />;
}
