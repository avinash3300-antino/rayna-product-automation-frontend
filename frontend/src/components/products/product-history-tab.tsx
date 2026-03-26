"use client";

import {
  Plus,
  RefreshCw,
  ArrowRightLeft,
  FileText,
  Tag,
  Link2,
  Upload,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import type { Product, HistoryAction } from "@/types/products";

interface ProductHistoryTabProps {
  product: Product;
}

const actionConfig: Record<
  HistoryAction,
  { icon: typeof Plus; label: string; color: string }
> = {
  created: { icon: Plus, label: "Created", color: "text-emerald-600 bg-emerald-500/10" },
  updated: { icon: RefreshCw, label: "Updated", color: "text-blue-600 bg-blue-500/10" },
  status_changed: { icon: ArrowRightLeft, label: "Status Changed", color: "text-amber-600 bg-amber-500/10" },
  content_generated: { icon: FileText, label: "Content Generated", color: "text-purple-600 bg-purple-500/10" },
  tags_updated: { icon: Tag, label: "Tags Updated", color: "text-cyan-600 bg-cyan-500/10" },
  booking_source_assigned: { icon: Link2, label: "Booking Source", color: "text-indigo-600 bg-indigo-500/10" },
  published: { icon: Upload, label: "Published", color: "text-emerald-600 bg-emerald-500/10" },
  archived: { icon: Archive, label: "Archived", color: "text-red-600 bg-red-500/10" },
};

export function ProductHistoryTab({ product }: ProductHistoryTabProps) {
  const { history } = product;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          History ({history.length} events)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-sm">No history recorded</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {history.map((entry) => {
                const config = actionConfig[entry.action];
                const Icon = config.icon;

                return (
                  <div key={entry.id} className="relative flex gap-4 pl-0">
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        config.color
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{config.label}</span>
                        <span className="text-xs text-muted-foreground">
                          by {entry.user}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
