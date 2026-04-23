"use client";

import {
  Building2,
  Globe,
  ExternalLink,
  CalendarDays,
  Award,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/types/activities";

interface ActivityOperatorTabProps {
  activity: Activity;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

export function ActivityOperatorTab({ activity }: ActivityOperatorTabProps) {
  const hasOperatorInfo =
    activity.operatorName ||
    activity.operatorWebsite ||
    activity.operatorEstablishedYear ||
    (activity.operatorCertifications && activity.operatorCertifications.length > 0);

  if (!hasOperatorInfo) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Building2 className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No Operator Information</p>
            <p className="text-xs mt-1">
              Operator details have not been collected for this activity.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Operator Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Operator Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Name */}
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">
                  {activity.operatorName || <EmptyField />}
                </p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                {activity.operatorWebsite ? (
                  <a
                    href={activity.operatorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 underline underline-offset-2"
                  >
                    {activity.operatorWebsite.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <EmptyField />
                )}
              </div>
            </div>

            {/* Established Year */}
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Established</p>
                <p className="text-sm font-medium">
                  {activity.operatorEstablishedYear ?? <EmptyField />}
                </p>
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Verification</p>
                <Badge
                  variant="secondary"
                  className={
                    activity.verified
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {activity.verified ? "Verified Operator" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {activity.operatorCertifications && activity.operatorCertifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications ({activity.operatorCertifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activity.operatorCertifications.map((cert, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs gap-1.5 py-1.5 px-3"
                >
                  <Award className="h-3.5 w-3.5 text-[#C9A84C]" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
