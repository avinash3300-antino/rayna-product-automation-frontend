"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  Destination,
  IntelligenceSummary,
  KeywordIntent,
  TosStatus,
  ProductCategory,
} from "@/types/destinations";

interface IntelligenceSummarySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
  summary: IntelligenceSummary | null;
}

const intentStyles: Record<KeywordIntent, string> = {
  informational: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  transactional: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  navigational: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  commercial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const tosStyles: Record<TosStatus, string> = {
  compliant: "bg-emerald-500/10 text-emerald-600",
  pending_review: "bg-amber-500/10 text-amber-600",
  restricted: "bg-red-500/10 text-red-600",
};

const categoryColors: Record<string, string> = {
  hotels: "border-chart-1/30 text-chart-1",
  attractions: "border-chart-2/30 text-chart-2",
  transfers: "border-chart-3/30 text-chart-3",
  restaurants: "border-chart-4/30 text-chart-4",
};

export function IntelligenceSummarySheet({
  open,
  onOpenChange,
  destination,
  summary,
}: IntelligenceSummarySheetProps) {
  if (!destination || !summary) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-hidden flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            {destination.countryFlag} {destination.name} — Intelligence Summary
          </SheetTitle>
          <SheetDescription>
            Keyword research and approved source analysis
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Top Keywords */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Top Keywords</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Difficulty</TableHead>
                  <TableHead>Intent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.topKeywords.map((kw) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          categoryColors[kw.category]
                        )}
                      >
                        {kw.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {kw.volume.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {kw.difficulty}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", intentStyles[kw.intent])}
                      >
                        {kw.intent}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-6" />

          {/* Approved Source List */}
          <div className="space-y-3 pb-4">
            <h3 className="text-sm font-semibold">Approved Source List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="text-right">Relevance</TableHead>
                  <TableHead>ToS</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.approvedSources.map((src) => (
                  <TableRow key={src.id}>
                    <TableCell className="font-medium">{src.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {src.type.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {src.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className={cn(
                              "text-[10px] h-5",
                              categoryColors[cat]
                            )}
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {src.relevanceScore}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", tosStyles[src.tosStatus])}
                      >
                        {src.tosStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {src.ingestionMethod}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      #{src.priorityRank}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        <SheetFooter className="border-t pt-4 mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hold for Review
          </Button>
          <Button>Approve & Launch Ingestion</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
