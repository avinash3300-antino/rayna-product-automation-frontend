"use client";

import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PipelineStageData } from "@/types/dashboard";

const STAGE_COLORS: Record<string, string> = {
  draft: "bg-chart-1",
  enriched: "bg-chart-2",
  review_ready: "bg-chart-3",
  approved: "bg-gold",
  published: "bg-emerald-500",
};

interface PipelineHealthProps {
  data: PipelineStageData[];
}

export function PipelineHealth({ data }: PipelineHealthProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pipeline Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[540px]">
            {data.map((stage, i) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white",
                      STAGE_COLORS[stage.id] || "bg-chart-4",
                      stage.count > 20 && "animate-pulse-node"
                    )}
                  >
                    {stage.count}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stage.label}
                  </span>
                </div>
                {i < data.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
