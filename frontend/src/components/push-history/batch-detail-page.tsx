"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  AlertTriangle,
  SkipForward,
  Copy,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RollbackConfirmationModal } from "./rollback-confirmation-modal";
import { MOCK_PUSH_BATCHES, MOCK_ROLLBACK_HISTORY } from "@/lib/mock-push-history-data";
import { PUSH_BATCH_STATUS_CONFIG } from "@/types/push-history";
import type { PushBatch, BatchItem } from "@/types/push-history";
import { formatDuration, truncateUuid } from "@/lib/format";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ITEMS_PAGE_SIZE = 50;

const OPERATION_CONFIG = {
  create: {
    label: "Create",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  update: {
    label: "Update",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  delete: {
    label: "Delete",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

const ITEM_STATUS_CONFIG = {
  success: {
    label: "Success",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  skipped: {
    label: "Skipped",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

interface BatchDetailPageProps {
  batchId: string;
}

export function BatchDetailPage({ batchId }: BatchDetailPageProps) {
  const batch = MOCK_PUSH_BATCHES.find((b) => b.id === batchId) ?? null;

  const [itemsPage, setItemsPage] = useState(1);
  const [diffOpen, setDiffOpen] = useState(true);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Rollback history for this batch
  const batchRollbacks = useMemo(
    () => MOCK_ROLLBACK_HISTORY.filter((r) => r.originalBatchId === batchId),
    [batchId]
  );

  // Items grouped by type
  const itemsByStatus = useMemo(() => {
    if (!batch) return { created: [], updated: [], failed: [], skipped: [] };
    return {
      created: batch.items.filter((i) => i.operation === "create" && i.status === "success"),
      updated: batch.items.filter((i) => i.operation === "update" && i.status === "success"),
      failed: batch.items.filter((i) => i.status === "failed"),
      skipped: batch.items.filter((i) => i.status === "skipped"),
    };
  }, [batch]);

  // Items pagination
  const totalItemsPages = batch
    ? Math.ceil(batch.items.length / ITEMS_PAGE_SIZE)
    : 0;
  const itemsStartIdx = (itemsPage - 1) * ITEMS_PAGE_SIZE;
  const pageItems = batch
    ? batch.items.slice(itemsStartIdx, itemsStartIdx + ITEMS_PAGE_SIZE)
    : [];

  const handleCopyId = useCallback(async () => {
    if (!batch) return;
    await navigator.clipboard.writeText(batch.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }, [batch]);

  if (!batch) {
    return (
      <div className="space-y-6">
        <Link href="/push-history">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Push History
          </Button>
        </Link>
        <Card className="border-border/50 bg-navy-light/30 p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground">
            Batch Not Found
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            The batch ID &quot;{batchId}&quot; does not exist.
          </p>
        </Card>
      </div>
    );
  }

  const statusConfig = PUSH_BATCH_STATUS_CONFIG[batch.status];
  const isPendingApproval = batch.status === "pending_approval";
  const isCompletedProduction =
    batch.status === "completed" && batch.environment === "production";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/push-history"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Push History
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">
          Batch #{truncateUuid(batch.id.replace("pb-", ""))}
        </span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/push-history">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Batch Detail</h1>
            <Badge variant="outline" className={statusConfig.color}>
              {batch.status === "in_progress" && (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              )}
              {statusConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className={
                batch.environment === "production"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }
            >
              {batch.environment}
            </Badge>
          </div>

          {/* Batch ID with copy */}
          <div className="flex items-center gap-2 ml-12">
            <span className="font-mono text-sm text-gold">{batch.id}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyId}
              className="h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-3 w-3" />
              <span className="ml-1 text-xs">
                {copiedId ? "Copied!" : "Copy"}
              </span>
            </Button>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-3 ml-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {batch.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Triggered by {batch.triggeredBy}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(batch.triggeredAt)}
            </span>
            {batch.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Completed in {formatDuration(batch.duration)}
              </span>
            )}
          </div>

          {/* Approved by */}
          {batch.approvedBy ? (
            <div className="flex items-center gap-1.5 mt-2 ml-12 text-sm text-muted-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              Approved by {batch.approvedBy}
              {batch.approvedAt && (
                <span className="ml-1">on {formatDate(batch.approvedAt)}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-2 ml-12 text-sm text-amber-400">
              <Clock className="h-3.5 w-3.5" />
              Awaiting Approval
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {batch.records.created}
              </p>
              <p className="text-sm text-muted-foreground">Created</p>
            </div>
          </div>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <RefreshCw className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {batch.records.updated}
              </p>
              <p className="text-sm text-muted-foreground">Updated</p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-4 ${
            batch.records.failed > 0
              ? "border-red-500/20 bg-red-500/5"
              : "border-border/50 bg-navy-light/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                batch.records.failed > 0 ? "bg-red-500/20" : "bg-gray-500/20"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  batch.records.failed > 0 ? "text-red-400" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  batch.records.failed > 0 ? "text-red-400" : "text-foreground"
                }`}
              >
                {batch.records.failed}
              </p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </Card>

        <Card className="border-border/50 bg-navy-light/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/20">
              <SkipForward className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {batch.records.skipped}
              </p>
              <p className="text-sm text-muted-foreground">Skipped</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Diff Summary Panel */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <button
          onClick={() => setDiffOpen(!diffOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-navy-light/50 transition-colors"
        >
          <div>
            <h3 className="font-semibold text-foreground">
              What changed in this batch
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Summary of all changes
            </p>
          </div>
          {diffOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {diffOpen && (
          <div className="border-t border-border/50 p-4 space-y-4">
            {/* New Products */}
            {itemsByStatus.created.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  New Products ({itemsByStatus.created.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {itemsByStatus.created.slice(0, 15).map((item) => (
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                    >
                      {item.entityName}
                    </Badge>
                  ))}
                  {itemsByStatus.created.length > 15 && (
                    <Badge
                      variant="outline"
                      className="bg-navy-light/50 text-muted-foreground border-border/50 text-xs"
                    >
                      +{itemsByStatus.created.length - 15} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Updated Products */}
            {itemsByStatus.updated.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" />
                  Updated Products ({itemsByStatus.updated.length})
                </h4>
                <div className="space-y-2">
                  {itemsByStatus.updated.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border/50 bg-navy/30 p-3"
                    >
                      <p className="text-sm font-medium text-foreground mb-1">
                        {item.entityName}
                      </p>
                      {item.changes.length > 0 && (
                        <div className="space-y-1">
                          {item.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span className="font-mono text-gold/80">
                                {change.field}
                              </span>
                              {change.oldValue && (
                                <span className="text-red-400/60 line-through">
                                  {change.oldValue.slice(0, 30)}
                                  {change.oldValue.length > 30 ? "..." : ""}
                                </span>
                              )}
                              <span className="text-muted-foreground">
                                &rarr;
                              </span>
                              {change.newValue && (
                                <span className="text-emerald-400/80">
                                  {change.newValue.slice(0, 30)}
                                  {change.newValue.length > 30 ? "..." : ""}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {itemsByStatus.updated.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{itemsByStatus.updated.length - 5} more updated products
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Failed Records */}
            {itemsByStatus.failed.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Failed Records ({itemsByStatus.failed.length})
                </h4>
                <div className="space-y-2">
                  {itemsByStatus.failed.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-red-500/20 bg-red-500/5 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {item.entityName}
                        </p>
                        <span className="text-xs font-mono text-muted-foreground">
                          {item.entityType}
                        </span>
                      </div>
                      {item.errorMessage && (
                        <p className="text-xs text-red-400 mt-1">
                          {item.errorMessage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Batch Items Table */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Batch Items</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {batch.items.length} total items
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">
                  Entity Type
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Product Name
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Operation
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  External Record ID
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Error Message
                </TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((item) => {
                const opConfig = OPERATION_CONFIG[item.operation];
                const statusCfg = ITEM_STATUS_CONFIG[item.status];
                return (
                  <TableRow
                    key={item.id}
                    className="border-border/50 hover:bg-navy-light/50"
                  >
                    <TableCell className="text-sm text-foreground">
                      {item.entityType}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.entityName}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          {truncateUuid(item.entityId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={opConfig.color}>
                        {opConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusCfg.color}>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {item.externalRecordId
                        ? truncateUuid(item.externalRecordId)
                        : "\u2014"}
                    </TableCell>
                    <TableCell className="text-sm text-red-400 max-w-[250px] truncate">
                      {item.errorMessage || "\u2014"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "failed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-gold"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {batch.items.length > ITEMS_PAGE_SIZE && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {itemsStartIdx + 1}&ndash;
              {Math.min(itemsStartIdx + ITEMS_PAGE_SIZE, batch.items.length)} of{" "}
              {batch.items.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={itemsPage === 1}
                onClick={() => setItemsPage((p) => p - 1)}
                className="border-border/50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={itemsPage === totalItemsPages}
                onClick={() => setItemsPage((p) => p + 1)}
                className="border-border/50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Approval Section (for pending_approval batches) */}
      {isPendingApproval && (
        <Card className="border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold text-foreground">
              Awaiting Your Approval
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This batch is awaiting your approval before production push. Review
            the changes above and provide your decision below.
          </p>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="approval-notes"
                className="text-sm text-muted-foreground"
              >
                Approval Notes
              </Label>
              <Textarea
                id="approval-notes"
                placeholder="Add your review notes here..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-1.5 bg-navy/50 border-border/50 focus:border-gold/50 min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve &amp; Push to Production
              </Button>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Batch
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Approved Info */}
      {batch.status === "approved" && batch.approvedBy && (
        <Card className="border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-foreground">Batch Approved</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Approved by: {batch.approvedBy}</p>
            {batch.approvedAt && <p>Approved at: {formatDate(batch.approvedAt)}</p>}
          </div>
        </Card>
      )}

      {/* Rollback Section (for completed production batches) */}
      {isCompletedProduction && (
        <Card className="border-border/50 bg-navy-light/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-foreground">Rollback</h3>
            </div>
            <Button
              onClick={() => setRollbackOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Initiate Rollback
            </Button>
          </div>

          {/* Rollback History for this batch */}
          {batchRollbacks.length > 0 && (
            <>
              <Separator className="my-4 bg-border/50" />
              <h4 className="text-sm font-medium text-foreground mb-3">
                Rollback History
              </h4>
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs">
                        Rollback ID
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs">
                        Initiated By
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs">
                        Reason
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchRollbacks.map((rb) => (
                      <TableRow
                        key={rb.id}
                        className="border-border/50"
                      >
                        <TableCell className="font-mono text-xs text-gold">
                          {rb.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {rb.initiatedBy}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {rb.reason}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              rb.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                                : rb.status === "failed"
                                ? "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                            }
                          >
                            {rb.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(rb.initiatedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Rolled back info */}
      {batch.status === "rolled_back" && (
        <Card className="border-orange-500/20 bg-orange-500/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-foreground">
              This Batch Has Been Rolled Back
            </h3>
          </div>
          {batchRollbacks.length > 0 && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Rolled back by: {batchRollbacks[0].initiatedBy}
              </p>
              <p>
                Reason: {batchRollbacks[0].reason}
              </p>
              <p>
                Date: {formatDate(batchRollbacks[0].initiatedAt)}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Rollback Confirmation Modal */}
      <RollbackConfirmationModal
        batch={batch}
        open={rollbackOpen}
        onOpenChange={setRollbackOpen}
        onConfirm={() => {
          setRollbackOpen(false);
        }}
      />
    </div>
  );
}
