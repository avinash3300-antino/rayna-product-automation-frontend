"use client";

import { useState, useEffect, useCallback } from "react";
import { ActiveJobsSection } from "./active-jobs-section";
import { JobHistoryTable } from "./job-history-table";
import { JobDetailSheet } from "./job-detail-sheet";
import {
  MOCK_ACTIVE_JOBS,
  MOCK_JOB_HISTORY,
} from "@/lib/mock-ingestion-data";
import type { ActiveIngestionJob, IngestionJob } from "@/types/ingestion";

const PAGE_SIZE = 10;

export function IngestionMonitor() {
  const [activeJobs, setActiveJobs] =
    useState<ActiveIngestionJob[]>(MOCK_ACTIVE_JOBS);
  const [jobHistory] = useState<IngestionJob[]>(MOCK_JOB_HISTORY);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(Date.now());

  // Tick every second for live elapsed time
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs((prev) =>
        prev.map((job) => {
          const updatedSources = job.sources.map((src) => {
            if (src.status === "fetching") {
              const increment = Math.floor(Math.random() * 25 + 5);
              return {
                ...src,
                recordsFetched: src.recordsFetched + increment,
              };
            }
            return src;
          });
          const totalFetched = updatedSources.reduce(
            (sum, s) => sum + s.recordsFetched,
            0
          );
          return {
            ...job,
            sources: updatedSources,
            recordsFetched: Math.min(totalFetched, job.estimatedTotal),
          };
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelJob = useCallback((jobId: string) => {
    setActiveJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const handleViewDetails = useCallback(
    (jobId: string) => {
      setSelectedJobId(jobId);
      setDetailSheetOpen(true);
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Find the selected job from either active or history
  const selectedJob: IngestionJob | null = selectedJobId
    ? (jobHistory.find((j) => j.id === selectedJobId) ?? null)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Ingestion Monitor
        </h2>
        <p className="text-muted-foreground">
          Track active ingestion jobs and review history
        </p>
      </div>

      {/* Active Jobs */}
      <ActiveJobsSection
        jobs={activeJobs}
        now={now}
        onCancelJob={handleCancelJob}
        onViewDetails={handleViewDetails}
      />

      {/* Job History */}
      <JobHistoryTable
        jobs={jobHistory}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Sheet */}
      <JobDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        job={selectedJob}
      />
    </div>
  );
}
