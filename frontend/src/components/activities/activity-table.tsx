"use client";

import { useRouter } from "next/navigation";
import { Eye, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  formatPrice,
  getQualityScoreColor,
  getQualityScoreTextColor,
  statusStyles,
  statusLabels,
} from "./activity-card";
import type { ActivityCardItem } from "@/types/activities";

interface ActivityTableProps {
  activities: ActivityCardItem[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  const router = useRouter();

  function handleRowClick(id: string) {
    router.push(`/activities/${id}`);
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground py-12"
              >
                No activities match the current filters
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => (
              <TableRow
                key={activity.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(activity.id)}
              >
                {/* Name */}
                <TableCell className="font-medium max-w-[220px] truncate">
                  {activity.name}
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {activity.category.replace("_", " ")}
                  </Badge>
                </TableCell>

                {/* City */}
                <TableCell className="text-sm text-muted-foreground">
                  {activity.city}
                </TableCell>

                {/* Price */}
                <TableCell className="text-sm font-medium text-[#C9A84C]">
                  {formatPrice(activity.priceFrom, activity.currency)}
                </TableCell>

                {/* Duration */}
                <TableCell className="text-sm text-muted-foreground">
                  {formatDuration(activity.durationMinutes)}
                </TableCell>

                {/* Rating */}
                <TableCell>
                  {activity.rating !== null ? (
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">
                        {activity.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({activity.reviewCount})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">--</span>
                  )}
                </TableCell>

                {/* Quality Score */}
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-[60px]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          getQualityScoreColor(activity.qualityScore)
                        )}
                        style={{
                          width: `${Math.min(activity.qualityScore, 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-mono tabular-nums",
                        getQualityScoreTextColor(activity.qualityScore)
                      )}
                    >
                      {activity.qualityScore}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs capitalize",
                      statusStyles[activity.status]
                    )}
                  >
                    {statusLabels[activity.status]}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div
                    className="flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleRowClick(activity.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
