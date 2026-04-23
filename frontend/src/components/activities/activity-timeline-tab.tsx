"use client";

import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types/activities";

interface ActivityTimelineTabProps {
  activity: Activity;
}

export function ActivityTimelineTab({ activity }: ActivityTimelineTabProps) {
  const timeline = activity.timeline ?? [];

  if (timeline.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Clock className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No Timeline Available</p>
            <p className="text-xs mt-1">
              This activity does not have itinerary steps yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...timeline].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          What You&rsquo;ll Do ({sorted.length} steps)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-6">
            {sorted.map((step, idx) => (
              <div key={idx} className="relative flex gap-4">
                {/* Circle dot */}
                <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C] bg-background">
                  <span className="text-xs font-bold text-[#C9A84C]">
                    {idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-1">
                  {step.timeLabel && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      {step.timeLabel}
                    </span>
                  )}
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
