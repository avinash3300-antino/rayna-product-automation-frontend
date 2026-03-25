"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingBatches } from "./pending-batches";
import { BatchReview } from "./batch-review";
import { PushHistoryTable } from "./push-history-table";
import { RollbackModal } from "./rollback-modal";
import {
  MOCK_STAGING_BATCHES,
  MOCK_PUSH_HISTORY,
} from "@/lib/mock-staging-data";
import type { StagingBatch, PushHistoryEntry } from "@/types/staging";

export function StagingApproval() {
  const [batches, setBatches] = useState<StagingBatch[]>(MOCK_STAGING_BATCHES);
  const [pushHistory, setPushHistory] =
    useState<PushHistoryEntry[]>(MOCK_PUSH_HISTORY);
  const [reviewingBatchId, setReviewingBatchId] = useState<string | null>(null);
  const [rollbackEntry, setRollbackEntry] =
    useState<PushHistoryEntry | null>(null);
  const [rollbackOpen, setRollbackOpen] = useState(false);

  const reviewingBatch = reviewingBatchId
    ? batches.find((b) => b.id === reviewingBatchId) ?? null
    : null;

  const handleReviewBatch = useCallback((batchId: string) => {
    setReviewingBatchId(batchId);
  }, []);

  const handleBackFromReview = useCallback(() => {
    setReviewingBatchId(null);
  }, []);

  const handleApprove = useCallback(
    (batchId: string, notes: string) => {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === batchId
            ? {
                ...b,
                status: "pushed" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: "Admin User",
                reviewNotes: notes || null,
                pushedAt: new Date().toISOString(),
                pushedBy: "Admin User",
                environment: "production" as const,
              }
            : b
        )
      );

      const batch = batches.find((b) => b.id === batchId);
      if (batch) {
        const newEntry: PushHistoryEntry = {
          id: `push-${Date.now()}`,
          batchId,
          destination: batch.destination,
          environment: "production",
          status: "success",
          records: batch.records,
          triggeredBy: "Admin User",
          pushedAt: new Date().toISOString(),
          rolledBackAt: null,
          rollbackReason: null,
        };
        setPushHistory((prev) => [newEntry, ...prev]);
      }

      setReviewingBatchId(null);
    },
    [batches]
  );

  const handleReject = useCallback((batchId: string, notes: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: "rejected" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "Admin User",
              reviewNotes: notes || null,
            }
          : b
      )
    );
    setReviewingBatchId(null);
  }, []);

  const handleRollbackClick = useCallback((entry: PushHistoryEntry) => {
    setRollbackEntry(entry);
    setRollbackOpen(true);
  }, []);

  const handleRollbackConfirm = useCallback(
    (entryId: string, reason: string) => {
      setPushHistory((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? {
                ...e,
                status: "rolled_back" as const,
                rolledBackAt: new Date().toISOString(),
                rollbackReason: reason,
              }
            : e
        )
      );
      setBatches((prev) =>
        prev.map((b) =>
          b.id === rollbackEntry?.batchId
            ? { ...b, status: "rolled_back" as const }
            : b
        )
      );
      setRollbackOpen(false);
      setRollbackEntry(null);
    },
    [rollbackEntry]
  );

  // If reviewing a batch, show the review page
  if (reviewingBatch) {
    return (
      <BatchReview
        batch={reviewingBatch}
        onBack={handleBackFromReview}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-navy-light/50 border border-border/50">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
          >
            Pending Approval
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
          >
            Push History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingBatches
            batches={batches}
            onReviewBatch={handleReviewBatch}
          />
        </TabsContent>

        <TabsContent value="history">
          <PushHistoryTable
            history={pushHistory}
            onRollback={handleRollbackClick}
          />
        </TabsContent>
      </Tabs>

      <RollbackModal
        entry={rollbackEntry}
        open={rollbackOpen}
        onOpenChange={setRollbackOpen}
        onConfirm={handleRollbackConfirm}
      />
    </div>
  );
}
