"use client";

import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 0.7) return "bg-emerald-500";
  if (score >= 0.5) return "bg-amber-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 0.7) return "text-emerald-600";
  if (score >= 0.5) return "text-amber-600";
  return "text-red-600";
}

export function ConfidenceGauge({
  score,
  showLabel = true,
  className,
}: ConfidenceGaugeProps) {
  const percentage = Math.round(score * 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Confidence</span>
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              getScoreTextColor(score)
            )}
          >
            {score.toFixed(2)} ({percentage}%)
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            getScoreColor(score)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
