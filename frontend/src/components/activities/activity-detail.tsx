"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Eye,
  RefreshCw,
  Trash2,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useActivity, useReEnrichActivity } from "@/hooks/api/use-activities";
import { ActivityOverviewTab } from "./activity-overview-tab";
import { ActivityContentTab } from "./activity-content-tab";
import { ActivityLocationTab } from "./activity-location-tab";
import { ActivityPricingTab } from "./activity-pricing-tab";
import { ActivitySeoTab } from "./activity-seo-tab";
import { ActivityMediaTab } from "./activity-media-tab";
import { ActivitySourceTab } from "./activity-source-tab";
import { DeleteActivityDialog } from "./delete-activity-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";
import type { ActivityStatus } from "@/types/activities";

interface ActivityDetailProps {
  activityId: string;
}

const statusStyles: Record<ActivityStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  enriched: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  review_ready: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  published: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
};

function getQualityScoreStyle(score: number): string {
  if (score > 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (score > 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

export function ActivityDetail({ activityId }: ActivityDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const { data: activity, isLoading, isError } = useActivity(activityId);
  const reEnrich = useReEnrichActivity();

  const handleReEnrich = () => {
    reEnrich.mutate(activityId, {
      onSuccess: () => {
        toast.success("Re-enrichment started successfully");
      },
      onError: () => {
        toast.error("Failed to start re-enrichment");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-3" />
        <p className="text-sm">Loading activity...</p>
      </div>
    );
  }

  if (isError || !activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Activity not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/activities")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mt-0.5"
            onClick={() => router.push("/activities")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight">
                {activity.name}
              </h2>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs capitalize",
                  statusStyles[activity.status]
                )}
              >
                {activity.status.replace("_", " ")}
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getQualityScoreStyle(activity.qualityScore)
                )}
              >
                Quality: {activity.qualityScore}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {activity.city}, {activity.country} &middot; {activity.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button
            variant={editing ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                View Mode
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                Edit Mode
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setStatusOpen(true)}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Change Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleReEnrich}
            disabled={reEnrich.isPending}
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", reEnrich.isPending && "animate-spin")}
            />
            Re-Enrich
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-red-600 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ActivityOverviewTab activity={activity} />
        </TabsContent>

        <TabsContent value="content">
          <ActivityContentTab activity={activity} />
        </TabsContent>

        <TabsContent value="location">
          <ActivityLocationTab activity={activity} />
        </TabsContent>

        <TabsContent value="pricing">
          <ActivityPricingTab activity={activity} />
        </TabsContent>

        <TabsContent value="seo">
          <ActivitySeoTab activity={activity} />
        </TabsContent>

        <TabsContent value="media">
          <ActivityMediaTab activity={activity} />
        </TabsContent>

        <TabsContent value="source">
          <ActivitySourceTab activity={activity} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DeleteActivityDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        activity={activity}
      />
      <UpdateStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        activity={activity}
      />
    </div>
  );
}
