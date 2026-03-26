"use client";

import { RotateCcw, Plus, Minus, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PUSH_STATUS_CONFIG } from "@/types/staging";
import type { PushHistoryEntry } from "@/types/staging";

interface PushHistoryTableProps {
  history: PushHistoryEntry[];
  onRollback: (entry: PushHistoryEntry) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PushHistoryTable({
  history,
  onRollback,
}: PushHistoryTableProps) {
  return (
    <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Push History</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {history.length} push records
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Batch ID</TableHead>
              <TableHead className="text-muted-foreground">Destination</TableHead>
              <TableHead className="text-muted-foreground">Environment</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Records</TableHead>
              <TableHead className="text-muted-foreground">Triggered By</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => {
              const statusConfig = PUSH_STATUS_CONFIG[entry.status];
              const canRollback =
                entry.status === "success" && !entry.rolledBackAt;

              return (
                <TableRow
                  key={entry.id}
                  className="border-border/50 hover:bg-navy-light/50"
                >
                  <TableCell className="font-mono text-sm text-gold">
                    {entry.batchId}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {entry.destination}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        entry.environment === "production"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      }
                    >
                      {entry.environment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Plus className="h-3 w-3" />
                        {entry.records.created}
                      </span>
                      <span className="flex items-center gap-1 text-blue-400">
                        <Minus className="h-3 w-3" />
                        {entry.records.updated}
                      </span>
                      {entry.records.failed > 0 && (
                        <span className="flex items-center gap-1 text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          {entry.records.failed}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.triggeredBy}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(entry.pushedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canRollback ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRollback(entry)}
                        className="text-muted-foreground hover:text-orange-400"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Rollback
                      </Button>
                    ) : entry.status === "rolled_back" ? (
                      <span className="text-xs text-orange-400/60">
                        Rolled back
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
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
