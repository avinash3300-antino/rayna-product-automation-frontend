"use client";

import { CheckCircle, XCircle, AlertTriangle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import type { Product, QualityCheckStatus } from "@/types/products";

interface ProductQualityTabProps {
  product: Product;
}

const statusConfig: Record<
  QualityCheckStatus,
  { icon: typeof CheckCircle; label: string; className: string }
> = {
  pass: {
    icon: CheckCircle,
    label: "Pass",
    className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  fail: {
    icon: XCircle,
    label: "Fail",
    className: "text-red-600 bg-red-500/10 border-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  skipped: {
    icon: MinusCircle,
    label: "Skipped",
    className: "text-muted-foreground bg-muted",
  },
};

export function ProductQualityTab({ product }: ProductQualityTabProps) {
  const { qualityChecks } = product;

  const passCount = qualityChecks.filter((q) => q.status === "pass").length;
  const failCount = qualityChecks.filter((q) => q.status === "fail").length;
  const warnCount = qualityChecks.filter((q) => q.status === "warning").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
        >
          {passCount} Passed
        </Badge>
        {warnCount > 0 && (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 border-amber-500/20"
          >
            {warnCount} Warning{warnCount !== 1 ? "s" : ""}
          </Badge>
        )}
        {failCount > 0 && (
          <Badge
            variant="secondary"
            className="bg-red-500/10 text-red-600 border-red-500/20"
          >
            {failCount} Failed
          </Badge>
        )}
      </div>

      {/* Checks */}
      <div className="space-y-3">
        {qualityChecks.map((check) => {
          const config = statusConfig[check.status];
          const Icon = config.icon;

          return (
            <Card key={check.id}>
              <CardContent className="flex items-start gap-3 p-4">
                <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.className.split(" ")[0])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium">{check.name}</h4>
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px]", config.className)}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {check.description}
                  </p>
                  {check.details && (
                    <p className="text-xs mt-1 font-medium">{check.details}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Checked {formatRelativeTime(check.checkedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {qualityChecks.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-sm">No quality checks have been run</p>
          </div>
        )}
      </div>
    </div>
  );
}
