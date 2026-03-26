"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  AlertCircle,
  User,
  ArrowRight,
  Hotel,
  Ticket,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EnrichmentQueueEntry, AttributeCategory } from "@/types/attributes";

const CATEGORY_ICON_MAP: Record<AttributeCategory, React.ReactNode> = {
  hotels: <Hotel className="h-3 w-3" />,
  attractions: <Ticket className="h-3 w-3" />,
  transfers: <Car className="h-3 w-3" />,
  restaurants: <UtensilsCrossed className="h-3 w-3" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

interface EnrichmentQueueProps {
  entries: EnrichmentQueueEntry[];
  onSelectProduct: (productId: string) => void;
}

export function EnrichmentQueue({
  entries,
  onSelectProduct,
}: EnrichmentQueueProps) {
  const [expanded, setExpanded] = useState(false);

  const pendingCount = entries.filter((e) => e.missingFields.length > 0).length;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg transition-all duration-300 ${
        expanded ? "h-[320px]" : "h-12"
      }`}
    >
      {/* Collapse/expand header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full h-12 px-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-gold" />
          <span className="text-sm font-semibold">
            Enrichment Queue:{" "}
            <span className="text-gold">{pendingCount} products</span> awaiting
            field completion
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-200 text-[10px]"
          >
            {entries.filter((e) => e.priority === "high").length} high
          </Badge>
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]"
          >
            {entries.filter((e) => e.priority === "medium").length} medium
          </Badge>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <ScrollArea className="h-[268px]">
          <div className="px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Missing Fields
                  </th>
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="text-right py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-2">
                      <span className="font-medium text-sm">
                        {entry.productName}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {CATEGORY_ICON_MAP[entry.category]}
                        <span className="text-xs capitalize">
                          {entry.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {entry.missingFields.slice(0, 3).map((field) => (
                          <Badge
                            key={field}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 text-red-500 border-red-200"
                          >
                            {field}
                          </Badge>
                        ))}
                        {entry.missingFields.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            +{entry.missingFields.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 capitalize ${
                          PRIORITY_COLORS[entry.priority]
                        }`}
                      >
                        {entry.priority}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {entry.assignedTo}
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-gold hover:text-gold hover:bg-gold/10 gap-1"
                        onClick={() => onSelectProduct(entry.productId)}
                      >
                        Edit
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
