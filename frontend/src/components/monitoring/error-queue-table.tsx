"use client";

import { CheckCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ERROR_STAGE_LABELS,
  ERROR_STATUS_CONFIG,
} from "@/types/monitoring";
import type { ErrorQueueEntry } from "@/types/monitoring";

interface ErrorQueueTableProps {
  errors: ErrorQueueEntry[];
  onResolve: (errorId: string) => void;
  onDismiss: (errorId: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ErrorQueueTable({
  errors,
  onResolve,
  onDismiss,
}: ErrorQueueTableProps) {
  const activeErrors = errors.filter(
    (e) => e.status === "open" || e.status === "retrying"
  );

  return (
    <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Error Queue</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeErrors.length} active error{activeErrors.length !== 1 ? "s" : ""}
          </p>
        </div>
        {activeErrors.length > 0 && (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-400 border-red-500/30"
          >
            {activeErrors.length} open
          </Badge>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Stage</TableHead>
              <TableHead className="text-muted-foreground">Entity</TableHead>
              <TableHead className="text-muted-foreground">Error Code</TableHead>
              <TableHead className="text-muted-foreground min-w-[240px]">
                Message
              </TableHead>
              <TableHead className="text-muted-foreground text-center">
                Retries
              </TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Assigned To</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((error) => {
              const statusConfig = ERROR_STATUS_CONFIG[error.status];
              const isActive =
                error.status === "open" || error.status === "retrying";

              return (
                <TableRow
                  key={error.id}
                  className="border-border/50 hover:bg-navy-light/50"
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-navy/50 text-foreground border-border/50"
                    >
                      {ERROR_STAGE_LABELS[error.stage]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-foreground">
                        {error.entityType}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {error.entityId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                      {error.errorCode}
                    </code>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {error.errorMessage}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-mono text-foreground">
                      {error.retryCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {error.assignedTo || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {isActive && (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResolve(error.id)}
                          className="h-7 text-xs text-muted-foreground hover:text-emerald-400"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(error.id)}
                          className="h-7 text-xs text-muted-foreground hover:text-zinc-400"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                    {!isActive && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(error.createdAt)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
