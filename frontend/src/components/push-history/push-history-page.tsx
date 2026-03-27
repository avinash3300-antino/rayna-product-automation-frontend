"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  History,
  Download,
  Plus,
  Minus,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  RotateCcw,
  Loader2,
  Send,
  SkipForward,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RollbackModal } from "@/components/staging/rollback-modal";
import {
  MOCK_PUSH_BATCHES,
  MOCK_ROLLBACK_HISTORY,
  computePushHistorySummary,
} from "@/lib/mock-push-history-data";
import { PUSH_BATCH_STATUS_CONFIG } from "@/types/push-history";
import type { PushBatch } from "@/types/push-history";
import type { PushEnvironment } from "@/types/staging";
import type { PushHistoryEntry } from "@/types/staging";
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

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

const PAGE_SIZE = 10;

export function PushHistoryPage() {
  const defaultRange = getDefaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [envFilter, setEnvFilter] = useState<"all" | PushEnvironment>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Rollback state (convert PushBatch to PushHistoryEntry for the existing modal)
  const [rollbackEntry, setRollbackEntry] = useState<PushHistoryEntry | null>(
    null
  );
  const [rollbackOpen, setRollbackOpen] = useState(false);

  // Filter batches
  const filteredBatches = useMemo(() => {
    return MOCK_PUSH_BATCHES.filter((b) => {
      if (envFilter !== "all" && b.environment !== envFilter) return false;
      if (dateFrom && new Date(b.triggeredAt) < new Date(dateFrom))
        return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(b.triggeredAt) > to) return false;
      }
      return true;
    });
  }, [envFilter, dateFrom, dateTo]);

  // Summary stats
  const summary = useMemo(
    () => computePushHistorySummary(MOCK_PUSH_BATCHES, dateFrom, dateTo, envFilter),
    [dateFrom, dateTo, envFilter]
  );

  // Pagination
  const totalPages = Math.ceil(filteredBatches.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageBatches = filteredBatches.slice(startIdx, startIdx + PAGE_SIZE);

  // Reset page on filter change
  const handleEnvChange = useCallback((val: string) => {
    setEnvFilter(val as "all" | PushEnvironment);
    setCurrentPage(1);
  }, []);

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateFrom(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateTo(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  // Copy batch ID
  const handleCopyId = useCallback(async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Row expansion toggle
  const toggleRow = useCallback((id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  }, []);

  // Rollback
  const handleRollbackClick = useCallback((batch: PushBatch) => {
    const entry: PushHistoryEntry = {
      id: batch.id,
      batchId: batch.id,
      destination: batch.destination,
      environment: batch.environment,
      status: "success",
      records: { created: batch.records.created, updated: batch.records.updated, failed: batch.records.failed },
      triggeredBy: batch.triggeredBy,
      pushedAt: batch.triggeredAt,
      rolledBackAt: null,
      rollbackReason: null,
    };
    setRollbackEntry(entry);
    setRollbackOpen(true);
  }, []);

  const handleRollbackConfirm = useCallback(
    (_entryId: string, _reason: string) => {
      setRollbackOpen(false);
      setRollbackEntry(null);
    },
    []
  );

  // CSV export
  const handleExportCSV = useCallback(() => {
    const headers = [
      "Batch ID",
      "Destination",
      "Environment",
      "Status",
      "Created",
      "Updated",
      "Failed",
      "Skipped",
      "Triggered By",
      "Approved By",
      "Triggered At",
      "Completed At",
      "Duration (s)",
    ];
    const rows = filteredBatches.map((b) => [
      b.id,
      b.destination,
      b.environment,
      b.status,
      b.records.created,
      b.records.updated,
      b.records.failed,
      b.records.skipped,
      b.triggeredBy,
      b.approvedBy || "",
      b.triggeredAt,
      b.completedAt || "",
      b.duration ? Math.round(b.duration / 1000) : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-history-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredBatches, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
            <History className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Push History</h1>
            <p className="text-sm text-muted-foreground">
              Track all push batches and rollback activity
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              className="w-[150px] bg-navy-light/50 border-border/50 text-sm"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
              className="w-[150px] bg-navy-light/50 border-border/50 text-sm"
            />
          </div>

          <Select value={envFilter} onValueChange={handleEnvChange}>
            <SelectTrigger className="w-[150px] bg-navy-light/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-navy border-border/50">
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-navy-light/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
              <Send className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {summary.totalPushes}
              </p>
              <p className="text-sm text-muted-foreground">Total Pushes</p>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <Plus className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {summary.totalCreated}
              </p>
              <p className="text-sm text-muted-foreground">Records Created</p>
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
                {summary.totalUpdated}
              </p>
              <p className="text-sm text-muted-foreground">Records Updated</p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-4 ${
            summary.totalFailed > 0
              ? "border-red-500/20 bg-red-500/5"
              : "border-border/50 bg-navy-light/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                summary.totalFailed > 0 ? "bg-red-500/20" : "bg-gray-500/20"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  summary.totalFailed > 0 ? "text-red-400" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  summary.totalFailed > 0 ? "text-red-400" : "text-foreground"
                }`}
              >
                {summary.totalFailed}
              </p>
              <p className="text-sm text-muted-foreground">Records Failed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Push Batches Table */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Push Batches</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredBatches.length} batches found
          </p>
        </div>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-8" />
                  <TableHead className="text-muted-foreground">
                    Batch ID
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Destination
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Environment
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Records
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Triggered By
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Approved By
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Triggered At
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Duration
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageBatches.map((batch) => {
                  const statusConfig = PUSH_BATCH_STATUS_CONFIG[batch.status];
                  const isExpanded = expandedRowId === batch.id;
                  const canRollback =
                    batch.status === "completed" &&
                    batch.environment === "production";

                  return (
                    <>
                      <TableRow
                        key={batch.id}
                        className="border-border/50 hover:bg-navy-light/50 cursor-pointer"
                        onClick={() => toggleRow(batch.id)}
                      >
                        <TableCell className="w-8">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyId(batch.id);
                                }}
                                className="font-mono text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                              >
                                {truncateUuid(batch.id.replace("pb-", ""))}
                                <Copy className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-navy border-border/50">
                              {copiedId === batch.id
                                ? "Copied!"
                                : "Click to copy full ID"}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {batch.destination}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusConfig.color} ${
                              batch.status === "in_progress"
                                ? "flex items-center gap-1 w-fit"
                                : ""
                            }`}
                          >
                            {batch.status === "in_progress" && (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            )}
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Plus className="h-3 w-3" />
                              {batch.records.created}
                            </span>
                            <span className="flex items-center gap-1 text-blue-400">
                              <Minus className="h-3 w-3" />
                              {batch.records.updated}
                            </span>
                            {batch.records.failed > 0 && (
                              <span className="flex items-center gap-1 text-red-400">
                                <AlertTriangle className="h-3 w-3" />
                                {batch.records.failed}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {batch.triggeredBy}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {batch.approvedBy || (
                            <span className="text-muted-foreground/50">
                              &mdash;
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(batch.triggeredAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {batch.duration
                            ? formatDuration(batch.duration)
                            : "\u2014"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={`/push-history/${encodeURIComponent(batch.id)}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-gold"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            {canRollback && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRollbackClick(batch)}
                                className="text-muted-foreground hover:text-red-400"
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Rollback
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row - Item Breakdown */}
                      {isExpanded && (
                        <TableRow
                          key={`${batch.id}-expanded`}
                          className="border-border/50 bg-navy/30"
                        >
                          <TableCell colSpan={11} className="p-0">
                            <div className="p-4">
                              <h4 className="text-sm font-medium text-foreground mb-3">
                                Item Breakdown ({batch.items.length} items)
                              </h4>
                              <div className="overflow-x-auto rounded-lg border border-border/50">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                      <TableHead className="text-muted-foreground text-xs">
                                        Entity Type
                                      </TableHead>
                                      <TableHead className="text-muted-foreground text-xs">
                                        Entity ID
                                      </TableHead>
                                      <TableHead className="text-muted-foreground text-xs">
                                        Operation
                                      </TableHead>
                                      <TableHead className="text-muted-foreground text-xs">
                                        Status
                                      </TableHead>
                                      <TableHead className="text-muted-foreground text-xs">
                                        External Record ID
                                      </TableHead>
                                      <TableHead className="text-muted-foreground text-xs">
                                        Error Message
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {batch.items.slice(0, 10).map((item) => (
                                      <TableRow
                                        key={item.id}
                                        className="border-border/50"
                                      >
                                        <TableCell className="text-xs text-foreground">
                                          {item.entityType}
                                        </TableCell>
                                        <TableCell className="text-xs font-mono text-muted-foreground">
                                          {truncateUuid(item.entityId)}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className={
                                              item.operation === "create"
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                                                : item.operation === "update"
                                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                                                : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                                            }
                                          >
                                            {item.operation}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className={
                                              item.status === "success"
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                                                : item.status === "failed"
                                                ? "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                                                : "bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs"
                                            }
                                          >
                                            {item.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-mono text-muted-foreground">
                                          {item.externalRecordId || "\u2014"}
                                        </TableCell>
                                        <TableCell className="text-xs text-red-400 max-w-[200px] truncate">
                                          {item.errorMessage || "\u2014"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              {batch.items.length > 10 && (
                                <div className="mt-2 text-center">
                                  <Link
                                    href={`/push-history/${encodeURIComponent(batch.id)}`}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gold hover:text-gold/80"
                                    >
                                      View all {batch.items.length} items
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Pagination */}
        {filteredBatches.length > PAGE_SIZE && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {startIdx + 1}&ndash;
              {Math.min(startIdx + PAGE_SIZE, filteredBatches.length)} of{" "}
              {filteredBatches.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-border/50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-border/50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Rollback History */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-orange-400" />
            Rollback History
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_ROLLBACK_HISTORY.length} rollback records
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">
                  Original Batch ID
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Destination
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Initiated By
                </TableHead>
                <TableHead className="text-muted-foreground">Reason</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  Records Affected
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Initiated At
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Completed At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ROLLBACK_HISTORY.map((rb) => (
                <TableRow
                  key={rb.id}
                  className="border-border/50 hover:bg-navy-light/50"
                >
                  <TableCell className="font-mono text-sm text-gold">
                    {truncateUuid(rb.originalBatchId.replace("pb-", ""))}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {rb.destination}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rb.initiatedBy}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                    {rb.reason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        rb.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : rb.status === "failed"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }
                    >
                      {rb.status === "in_progress" ? "In Progress" : rb.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {rb.recordsAffected}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(rb.initiatedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rb.completedAt ? formatDate(rb.completedAt) : "\u2014"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Rollback Modal (reuse existing) */}
      <RollbackModal
        entry={rollbackEntry}
        open={rollbackOpen}
        onOpenChange={setRollbackOpen}
        onConfirm={handleRollbackConfirm}
      />
    </div>
  );
}
