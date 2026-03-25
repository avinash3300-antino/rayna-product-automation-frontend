"use client";

import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActiveJobCard } from "./active-job-card";
import type { ActiveIngestionJob } from "@/types/ingestion";

interface ActiveJobsSectionProps {
  jobs: ActiveIngestionJob[];
  now: number;
  onCancelJob: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
}

export function ActiveJobsSection({
  jobs,
  now,
  onCancelJob,
  onViewDetails,
}: ActiveJobsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        {jobs.length > 0 ? (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            {jobs.length} running
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-muted-foreground">
            0 running
          </Badge>
        )}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
            <Activity className="mr-2 h-4 w-4" />
            No active ingestion jobs
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <ActiveJobCard
              key={job.id}
              job={job}
              now={now}
              onCancel={() => onCancelJob(job.id)}
              onViewDetails={() => onViewDetails(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
