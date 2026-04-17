"use client";

import { useState, useMemo, useCallback } from "react";
import { ReviewStats } from "./review-stats";
import { ReviewFilters } from "./review-filters";
import { ReviewTable } from "./review-table";
import { UnifiedReviewModal } from "./unified-review-modal";
import {
  MOCK_REVIEW_RECORDS,
  MOCK_REVIEW_STATS,
} from "@/lib/mock-review-data";
import type { ProductCategory } from "@/types/destinations";
import type { ContentFields } from "@/types/content-review";
import type {
  ReviewRecord,
  ReviewQueueStats,
  ReviewFilters as FilterState,
} from "@/types/review";

const PAGE_SIZE = 10;

const INITIAL_FILTERS: FilterState = {
  destination: "all",
  category: "all",
  dateFrom: "",
  dateTo: "",
  status: "all",
};

export function ReviewQueue() {
  const [records, setRecords] = useState<ReviewRecord[]>(MOCK_REVIEW_RECORDS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReviewRecord | null>(
    null
  );

  const stats: ReviewQueueStats = MOCK_REVIEW_STATS;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        if (filters.destination !== "all" && r.destination !== filters.destination)
          return false;
        if (filters.category !== "all" && r.category !== filters.category)
          return false;
        if (filters.status !== "all" && r.status !== filters.status)
          return false;
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom + "T00:00:00Z").getTime();
          if (new Date(r.createdAt).getTime() < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo + "T23:59:59Z").getTime();
          if (new Date(r.createdAt).getTime() > to) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [records, filters]);

  // Unique destinations for filter
  const destinations = useMemo(
    () => [...new Set(records.map((r) => r.destination))].sort(),
    [records]
  );

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleReviewClick = useCallback((record: ReviewRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  }, []);

  // Approve as-is
  const handleApprove = useCallback(
    (
      recordId: string,
      finalCategory: ProductCategory,
      notes: string,
      editedFields: ContentFields
    ) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                status: "approved" as const,
                finalCategory,
                reviewNotes: notes || null,
                publishFlag: true,
                reviewedBy: "Current User",
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      setModalOpen(false);
    },
    []
  );

  // Edit content & approve
  const handleEditAndApprove = useCallback(
    (
      recordId: string,
      finalCategory: ProductCategory,
      notes: string,
      editedFields: ContentFields
    ) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                contentFields: editedFields,
                status: "approved" as const,
                finalCategory,
                reviewNotes: notes || null,
                publishFlag: true,
                reviewedBy: "Current User",
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      setModalOpen(false);
    },
    []
  );

  // Reject & regenerate
  const handleRejectAndRegenerate = useCallback((recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: "pending" as const,
              generationAttempt: r.generationAttempt + 1,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setModalOpen(false);
  }, []);

  // Escalate
  const handleEscalate = useCallback((recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: "escalated" as const,
              reviewedBy: "Current User",
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setModalOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <ReviewStats stats={stats} />

      <ReviewFilters
        filters={filters}
        destinations={destinations}
        onFilterChange={handleFilterChange}
      />

      <ReviewTable
        records={filteredRecords}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onReviewClick={handleReviewClick}
      />

      <UnifiedReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        record={selectedRecord}
        onApprove={handleApprove}
        onEditAndApprove={handleEditAndApprove}
        onRejectAndRegenerate={handleRejectAndRegenerate}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
