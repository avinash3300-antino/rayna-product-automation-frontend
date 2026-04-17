"use client";

import { ActivityCard } from "./activity-card";
import type { ActivityCardItem } from "@/types/activities";

interface ActivityGridProps {
  activities: ActivityCardItem[];
}

export function ActivityGrid({ activities }: ActivityGridProps) {
  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        No activities match the current filters
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
