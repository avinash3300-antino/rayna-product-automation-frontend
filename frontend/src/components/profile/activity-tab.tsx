"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Pencil,
  Tag,
  UserPlus,
  Globe,
  RotateCcw,
  Play,
  Search,
  LogIn,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import type { ProfileActivityEntry, ProfileActionType } from "@/types/profile";
import { PROFILE_ACTION_TYPE_CONFIG } from "@/types/profile";
import { ACTIVITY_PAGE_SIZE } from "@/lib/mock-profile-data";

const ACTION_ICONS: Record<ProfileActionType, typeof CheckCircle> = {
  approved: CheckCircle,
  rejected: XCircle,
  edited: Pencil,
  tagged: Tag,
  assigned: UserPlus,
  published: Globe,
  rolled_back: RotateCcw,
  triggered: Play,
  reviewed: Search,
  login: LogIn,
};

interface ActivityTabProps {
  activities: ProfileActivityEntry[];
}

export function ActivityTab({ activities }: ActivityTabProps) {
  const [filterType, setFilterType] = useState<ProfileActionType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [visibleCount, setVisibleCount] = useState(ACTIVITY_PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = activities;

    if (filterType !== "all") {
      result = result.filter((a) => a.actionType === filterType);
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((a) => new Date(a.timestamp).getTime() >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000; // end of day
      result = result.filter((a) => new Date(a.timestamp).getTime() <= to);
    }

    return result;
  }, [activities, filterType, dateFrom, dateTo]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  function formatExactDate(iso: string): string {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Search className="h-4 w-4 text-cyan-500" />
          </div>
          <div>
            <CardTitle className="text-base">Activity Log</CardTitle>
            <CardDescription>Your recent actions across the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select
            value={filterType}
            onValueChange={(v) => {
              setFilterType(v as ProfileActionType | "all");
              setVisibleCount(ACTIVITY_PAGE_SIZE);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {Object.entries(PROFILE_ACTION_TYPE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>From</span>
            <Input
              type="date"
              className="w-36 h-9"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setVisibleCount(ACTIVITY_PAGE_SIZE);
              }}
            />
            <span>To</span>
            <Input
              type="date"
              className="w-36 h-9"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setVisibleCount(ACTIVITY_PAGE_SIZE);
              }}
            />
          </div>
        </div>

        {/* Timeline */}
        {visible.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No activity found for the selected filters.
          </div>
        ) : (
          <div className="relative">
            {visible.map((entry, idx) => {
              const config = PROFILE_ACTION_TYPE_CONFIG[entry.actionType];
              const Icon = ACTION_ICONS[entry.actionType];
              const isLast = idx === visible.length - 1;

              return (
                <div key={entry.id} className="relative pl-10 pb-8 last:pb-0">
                  {/* Vertical line */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-7 bottom-0 w-px bg-border" />
                  )}

                  {/* Icon dot */}
                  <div
                    className={cn(
                      "absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full text-white",
                      config.color
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {config.label}
                      </Badge>
                      <span
                        className="text-xs text-muted-foreground"
                        title={formatExactDate(entry.timestamp)}
                      >
                        {formatRelativeTime(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{entry.action}</p>
                    {entry.entity && (
                      <p className="text-xs text-muted-foreground">{entry.entity}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {remaining > 0 && (
          <div className="text-center pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisibleCount((c) => c + ACTIVITY_PAGE_SIZE)}
            >
              Load more ({remaining} remaining)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
