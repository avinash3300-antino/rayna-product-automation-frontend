"use client";

import { Clock, MapPin, Plus, Minus, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BATCH_STATUS_CONFIG } from "@/types/staging";
import type { StagingBatch } from "@/types/staging";

interface PendingBatchesProps {
  batches: StagingBatch[];
  onReviewBatch: (batchId: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PendingBatches({ batches, onReviewBatch }: PendingBatchesProps) {
  const pendingBatches = batches.filter(
    (b) => b.status === "pending_approval"
  );

  if (pendingBatches.length === 0) {
    return (
      <Card className="border-border/50 bg-navy-light/30 p-8 text-center">
        <p className="text-muted-foreground">No batches pending approval</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Pending Approval
        </h2>
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-400 border-amber-500/30"
        >
          {pendingBatches.length} batch{pendingBatches.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="grid gap-4">
        {pendingBatches.map((batch) => {
          const totalRecords =
            batch.records.created + batch.records.updated + batch.records.failed;
          const config = BATCH_STATUS_CONFIG[batch.status];

          return (
            <Card
              key={batch.id}
              className="border-border/50 bg-navy-light/30 p-5 hover:border-gold/30 transition-colors"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-gold">
                      {batch.jobId.slice(0, 8)}
                    </span>
                    <Badge variant="outline" className={config.color}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {batch.destination}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(batch.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Center: Record Counts */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Plus className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">
                      {batch.records.created}
                    </span>
                    <span className="text-muted-foreground">created</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Minus className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-blue-400 font-medium">
                      {batch.records.updated}
                    </span>
                    <span className="text-muted-foreground">updated</span>
                  </div>
                  {batch.records.failed > 0 && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                      <span className="text-red-400 font-medium">
                        {batch.records.failed}
                      </span>
                      <span className="text-muted-foreground">failed</span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    ({totalRecords} total)
                  </span>
                </div>

                {/* Right: Action */}
                <Button
                  onClick={() => onReviewBatch(batch.id)}
                  className="bg-gold hover:bg-gold-dark text-navy font-medium shrink-0"
                >
                  Review Batch
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
