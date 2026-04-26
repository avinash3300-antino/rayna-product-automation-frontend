"use client";

import { Search, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types/activities";

interface ActivitySeoTabProps {
  activity: Activity;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export function ActivitySeoTab({ activity }: ActivitySeoTabProps) {
  return (
    <div className="space-y-6">
      {/* Meta Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow
            label="Meta Title"
            value={activity.metaTitle || <EmptyField />}
          />
          <FieldRow
            label="Meta Description"
            value={
              activity.metaDescription ? (
                <p className="text-sm font-normal whitespace-pre-wrap">
                  {activity.metaDescription}
                </p>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Focus Keyword"
            value={
              activity.focusKeyword ? (
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {activity.focusKeyword}
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
        </CardContent>
      </Card>

    </div>
  );
}
