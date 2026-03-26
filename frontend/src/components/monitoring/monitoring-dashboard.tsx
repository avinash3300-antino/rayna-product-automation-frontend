"use client";

import { useState, useCallback, useEffect } from "react";
import { SourceHealthCards } from "./source-health-cards";
import { QueueLengthsChart } from "./queue-lengths-chart";
import { ErrorQueueTable } from "./error-queue-table";
import { FreshnessHeatmap } from "./freshness-heatmap";
import { JobMetricsChart } from "./job-metrics-chart";
import {
  MOCK_SOURCE_HEALTH,
  MOCK_QUEUE_LENGTHS,
  MOCK_ERROR_QUEUE,
  MOCK_JOB_METRICS,
} from "@/lib/mock-monitoring-data";
import type {
  SourceHealthEntry,
  QueueLengthData,
  ErrorQueueEntry,
} from "@/types/monitoring";

export function MonitoringDashboard() {
  const [sources, setSources] =
    useState<SourceHealthEntry[]>(MOCK_SOURCE_HEALTH);
  const [queueData, setQueueData] =
    useState<QueueLengthData[]>(MOCK_QUEUE_LENGTHS);
  const [errors, setErrors] = useState<ErrorQueueEntry[]>(MOCK_ERROR_QUEUE);

  // Simulate live queue data updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData((prev) => {
        const last = prev[prev.length - 1];
        const newPoint: QueueLengthData = {
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          queueA: Math.max(0, (last?.queueA ?? 12) + Math.floor(Math.random() * 7 - 3)),
          queueB: Math.max(0, (last?.queueB ?? 8) + Math.floor(Math.random() * 5 - 2)),
          enrichment: Math.max(0, (last?.enrichment ?? 15) + Math.floor(Math.random() * 9 - 4)),
          error: Math.max(0, (last?.error ?? 3) + Math.floor(Math.random() * 3 - 1)),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckNow = useCallback((sourceId: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? {
              ...s,
              lastCheckTime: new Date().toISOString(),
              responseMs:
                s.status === "down"
                  ? 0
                  : Math.floor(Math.random() * 200) + 100,
            }
          : s
      )
    );
  }, []);

  const handleResolveError = useCallback((errorId: string) => {
    setErrors((prev) =>
      prev.map((e) =>
        e.id === errorId ? { ...e, status: "resolved" as const } : e
      )
    );
  }, []);

  const handleDismissError = useCallback((errorId: string) => {
    setErrors((prev) =>
      prev.map((e) =>
        e.id === errorId ? { ...e, status: "dismissed" as const } : e
      )
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Row 1: Source Health */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Source Health
        </h2>
        <SourceHealthCards sources={sources} onCheckNow={handleCheckNow} />
      </div>

      {/* Row 2: Queue Lengths */}
      <QueueLengthsChart data={queueData} />

      {/* Row 3: Error Queue */}
      <ErrorQueueTable
        errors={errors}
        onResolve={handleResolveError}
        onDismiss={handleDismissError}
      />

      {/* Row 4: Freshness Heatmap + Job Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FreshnessHeatmap />
        <JobMetricsChart data={MOCK_JOB_METRICS} />
      </div>
    </div>
  );
}
