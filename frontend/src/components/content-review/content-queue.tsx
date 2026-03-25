"use client";

import { useState, useMemo, useCallback } from "react";
import { ContentStats } from "./content-stats";
import { ContentFilters } from "./content-filters";
import { ContentTable } from "./content-table";
import { ContentReviewModal } from "./content-review-modal";
import {
  MOCK_CONTENT_RECORDS,
  MOCK_CONTENT_STATS,
} from "@/lib/mock-content-data";
import type {
  ContentRecord,
  ContentFilters as FilterState,
  ContentQueueStats,
  ContentFields,
} from "@/types/content-review";

const PAGE_SIZE = 10;

const INITIAL_FILTERS: FilterState = {
  destination: "all",
  category: "all",
  dateFrom: "",
  dateTo: "",
  status: "all",
};

export function ContentQueue() {
  const [records, setRecords] =
    useState<ContentRecord[]>(MOCK_CONTENT_RECORDS);
  const [stats] = useState<ContentQueueStats>(MOCK_CONTENT_STATS);
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

  const handleApprove = useCallback((recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: "approved" as const,
              publishFlag: true,
              reviewedBy: "Current User",
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setReviewModalOpen(false);
  }, []);

  const handleEditAndApprove = useCallback(
    (recordId: string, editedFields: ContentFields) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                contentFields: editedFields,
                status: "approved" as const,
                publishFlag: true,
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
    setReviewModalOpen(false);
  }, []);

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
    setReviewModalOpen(false);
  }, []);

  const selectedRecord = selectedRecordId
    ? (records.find((r) => r.id === selectedRecordId) ?? null)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Review Queue B — Content
        </h2>
        <p className="text-muted-foreground">
          Review and approve AI-generated product content
        </p>
      </div>

      {/* Stats */}
      <ContentStats stats={stats} />

      {/* Filters */}
      <ContentFilters
        filters={filters}
        destinations={destinations}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <ContentTable
        records={filteredRecords}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onReviewClick={handleReviewClick}
      />

      {/* Review Modal */}
      <ContentReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        record={selectedRecord}
        onApprove={handleApprove}
        onEditAndApprove={handleEditAndApprove}
        onRejectAndRegenerate={handleRejectAndRegenerate}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
