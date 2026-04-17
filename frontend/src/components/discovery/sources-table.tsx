"use client";

import { useState, useMemo } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApproveSources } from "@/hooks/api/use-discovery";
import { AddSourceDialog } from "./add-source-dialog";
import { toast } from "sonner";
import type { ScrapeSource } from "@/types/discovery";

interface SourcesTableProps {
  sources: ScrapeSource[];
  runId: string;
  onApproved: () => void;
}

function TierBadge({ tier }: { tier: number }) {
  const variants: Record<number, string> = {
    1: "bg-[#C9A84C]/10 text-[#C9A84C]",
    2: "bg-blue-500/10 text-blue-500",
    3: "bg-muted text-muted-foreground",
  };
  return (
    <Badge className={`border-0 ${variants[tier] ?? variants[3]}`}>
      Tier {tier}
    </Badge>
  );
}

function ApprovedBadge({ approved }: { approved: boolean }) {
  if (approved) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 border-0">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Approved
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted text-muted-foreground border-0">
      <XCircle className="mr-1 h-3 w-3" />
      Not Approved
    </Badge>
  );
}

function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}

export function SourcesTable({
  sources,
  runId,
  onApproved,
}: SourcesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const approveSources = useApproveSources();

  const allSelected =
    sources.length > 0 && selectedIds.size === sources.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const selectedCount = selectedIds.size;
  const approvedCount = useMemo(
    () => sources.filter((s) => s.approved).length,
    [sources]
  );

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(sources.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function handleSelectOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function handleBulkAction(approved: boolean) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    approveSources.mutate(
      { runId, source_ids: ids, approved },
      {
        onSuccess: () => {
          toast.success(
            `${ids.length} source${ids.length > 1 ? "s" : ""} ${
              approved ? "approved" : "rejected"
            } successfully.`
          );
          setSelectedIds(new Set());
          onApproved();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to update sources"
          );
        },
      }
    );
  }

  function handleToggleApproval(source: ScrapeSource) {
    approveSources.mutate(
      { runId, source_ids: [source.id], approved: !source.approved },
      {
        onSuccess: () => {
          toast.success(
            `${source.sourceName} ${
              !source.approved ? "approved" : "rejected"
            }.`
          );
          onApproved();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to update source"
          );
        },
      }
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Discovered Sources</CardTitle>
              <CardDescription>
                {sources.length} source{sources.length !== 1 ? "s" : ""} found
                {" -- "}
                {approvedCount} approved
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Source
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                onClick={() => handleBulkAction(true)}
                disabled={approveSources.isPending}
              >
                {approveSources.isPending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={() => handleBulkAction(false)}
                disabled={approveSources.isPending}
              >
                {approveSources.isPending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <XCircle className="mr-1 h-3 w-3" />
                )}
                Reject Selected
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No sources discovered yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          (el as unknown as HTMLInputElement).indeterminate =
                            someSelected;
                        }
                      }}
                      onCheckedChange={(checked) =>
                        handleSelectAll(!!checked)
                      }
                      aria-label="Select all sources"
                    />
                  </TableHead>
                  <TableHead>Source Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Authority Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(source.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(source.id, !!checked)
                        }
                        aria-label={`Select ${source.sourceName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {source.sourceName}
                    </TableCell>
                    <TableCell>
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline text-sm"
                        title={source.sourceUrl}
                      >
                        {truncateUrl(source.sourceUrl)}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <TierBadge tier={source.tier} />
                    </TableCell>
                    <TableCell>
                      {source.authorityScore !== null
                        ? source.authorityScore
                        : "--"}
                    </TableCell>
                    <TableCell>
                      <ApprovedBadge approved={source.approved} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleApproval(source)}
                        disabled={approveSources.isPending}
                        className={
                          source.approved
                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                        }
                      >
                        {source.approved ? (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Approve
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddSourceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        runId={runId}
      />
    </>
  );
}
