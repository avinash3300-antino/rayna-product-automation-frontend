"use client";

import { Search, Link2, Code2, Tag } from "lucide-react";
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

      {/* Canonical URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Canonical URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.canonicalUrl ? (
            <a
              href={activity.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-400 underline underline-offset-2 break-all"
            >
              {activity.canonicalUrl}
            </a>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* JSON-LD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            JSON-LD Structured Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.jsonLd ? (
            <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto font-mono max-h-96 overflow-y-auto">
              {JSON.stringify(activity.jsonLd, null, 2)}
            </pre>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
