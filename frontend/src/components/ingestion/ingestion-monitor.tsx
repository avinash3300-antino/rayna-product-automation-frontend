"use client";

import { useState, useCallback } from "react";
import { JobHistoryTable } from "./job-history-table";
import { JobDetailSheet } from "./job-detail-sheet";
import { MOCK_JOB_HISTORY } from "@/lib/mock-ingestion-data";
import type { IngestionJob } from "@/types/ingestion";

const PAGE_SIZE = 10;

export function IngestionMonitor() {
  const [jobHistory] = useState<IngestionJob[]>(MOCK_JOB_HISTORY);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetails = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setDetailSheetOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
          Track ingestion jobs and review history
        </p>
      </div>

      {/* Jobs Table */}
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
