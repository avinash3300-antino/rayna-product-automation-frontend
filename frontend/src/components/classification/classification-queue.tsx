"use client";

import { useState, useMemo, useCallback } from "react";
import { ClassificationStats } from "./classification-stats";
import { ClassificationFilters } from "./classification-filters";
import { ClassificationTable } from "./classification-table";
import { RecordReviewModal } from "./record-review-modal";
import {
  MOCK_CLASSIFICATION_RECORDS,
  MOCK_CLASSIFICATION_STATS,
} from "@/lib/mock-classification-data";
import type {
  ClassificationRecord,
  ClassificationFilters as FilterState,
  ClassificationQueueStats,
  ReviewDecision,
  ReviewFormState,
} from "@/types/classification";

const PAGE_SIZE = 10;

const INITIAL_FILTERS: FilterState = {
  destination: "all",
  category: "all",
  dateFrom: "",
  dateTo: "",
  confidenceMin: 0,
  confidenceMax: 1,
};

export function ClassificationQueue() {
  const [records, setRecords] = useState<ClassificationRecord[]>(
    MOCK_CLASSIFICATION_RECORDS
  );
  const [stats] = useState<ClassificationQueueStats>(
    MOCK_CLASSIFICATION_STATS
  );
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    null
  );
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Derived: filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (
        filters.destination !== "all" &&
        r.destination !== filters.destination
      )
        return false;
      if (
        filters.category !== "all" &&
        r.predictedCategory !== filters.category
      )
        return false;
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom + "T00:00:00Z").getTime();
        if (new Date(r.createdAt).getTime() < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo + "T23:59:59Z").getTime();
        if (new Date(r.createdAt).getTime() > to) return false;
      }
      if (r.confidenceScore < filters.confidenceMin) return false;
      if (r.confidenceScore > filters.confidenceMax) return false;
      return true;
    });
  }, [records, filters]);

  // Extract unique destinations for filter dropdown
  const destinations = useMemo(
    () => [...new Set(records.map((r) => r.destination))].sort(),
    [records]
  );

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleReviewClick = useCallback((recordId: string) => {
    setSelectedRecordId(recordId);
    setReviewModalOpen(true);
  }, []);

  const handleReviewSubmit = useCallback(
    (recordId: string, decision: ReviewDecision, form: ReviewFormState) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                status:
                  decision === "approve"
                    ? ("approved" as const)
                    : decision === "reject"
                      ? ("rejected" as const)
                      : ("escalated" as const),
                finalCategory: form.finalCategory,
                reviewNotes: form.notes || null,
                reviewedBy: "Current User",
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      setReviewModalOpen(false);
    },
    []
  );

  const selectedRecord = selectedRecordId
    ? (records.find((r) => r.id === selectedRecordId) ?? null)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Review Queue A — Classification
        </h2>
        <p className="text-muted-foreground">
          Review and approve AI-classified product records
        </p>
      </div>

      {/* Stats */}
      <ClassificationStats stats={stats} />

      {/* Filters */}
      <ClassificationFilters
        filters={filters}
        destinations={destinations}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <ClassificationTable
        records={filteredRecords}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onReviewClick={handleReviewClick}
      />

      {/* Review Modal */}
      <RecordReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        record={selectedRecord}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
