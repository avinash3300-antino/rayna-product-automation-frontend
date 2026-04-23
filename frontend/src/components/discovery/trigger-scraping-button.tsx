"use client";

import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTriggerScraping } from "@/hooks/api/use-scraping";
import { toast } from "sonner";

interface TriggerScrapingButtonProps {
  runId: string;
  category: string;
  approvedCount: number;
  onJobsCreated?: (jobIds: string[]) => void;
}

export function TriggerScrapingButton({
  runId,
  category,
  approvedCount,
  onJobsCreated,
}: TriggerScrapingButtonProps) {
  const triggerScraping = useTriggerScraping();

  function handleTrigger() {
    triggerScraping.mutate(
      { discovery_run_id: runId, category },
      {
        onSuccess: (jobs) => {
          toast.success(
            `Pipeline started! Tracking ${jobs.length} source${
              jobs.length !== 1 ? "s" : ""
            }...`
          );
          onJobsCreated?.(jobs.map((j) => j.id));
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to trigger scraping"
          );
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#C9A84C]" />
          Trigger Scraping
        </CardTitle>
        <CardDescription>
          Start scraping all approved sources from this discovery run. This will
          create individual scrape jobs for each approved source.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {approvedCount}
            </span>{" "}
            approved source{approvedCount !== 1 ? "s" : ""} ready for scraping
          </div>
          <Button
            onClick={handleTrigger}
            disabled={
              approvedCount === 0 ||
              triggerScraping.isPending ||
              triggerScraping.isSuccess
            }
            className="w-full sm:w-auto"
          >
            {triggerScraping.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Triggering...
              </>
            ) : triggerScraping.isSuccess ? (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Scraping Triggered
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Trigger Scraping
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
