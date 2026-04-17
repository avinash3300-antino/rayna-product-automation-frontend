"use client";

import {
  FileText,
  ListChecks,
  CheckCircle2,
  XCircle,
  Backpack,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/types/activities";

interface ActivityContentTabProps {
  activity: Activity;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

export function ActivityContentTab({ activity }: ActivityContentTabProps) {
  return (
    <div className="space-y-6">
      {/* Short Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Short Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {activity.descriptionShort || <EmptyField />}
          </p>
        </CardContent>
      </Card>

      {/* Long Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Long Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.descriptionLong ? (
            <div
              className="text-sm prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: activity.descriptionLong }}
            />
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Highlights ({activity.highlights?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.highlights && activity.highlights.length > 0 ? (
            <ul className="space-y-2">
              {activity.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-[#C9A84C] mt-1 shrink-0">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Included / Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Included ({activity.included?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.included && activity.included.length > 0 ? (
              <ul className="space-y-2">
                {activity.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyField />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Excluded ({activity.excluded?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.excluded && activity.excluded.length > 0 ? (
              <ul className="space-y-2">
                {activity.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyField />
            )}
          </CardContent>
        </Card>
      </div>

      {/* What to Bring */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Backpack className="h-4 w-4" />
            What to Bring
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.whatToBring ? (
            <p className="text-sm whitespace-pre-wrap">{activity.whatToBring}</p>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.importantNotes ? (
            <p className="text-sm whitespace-pre-wrap">{activity.importantNotes}</p>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
