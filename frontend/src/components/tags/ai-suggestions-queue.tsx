"use client";

import { useState } from "react";
import { Sparkles, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TAG_DIMENSION_LABELS } from "@/types/products";
import type { AiTagSuggestion } from "@/types/tags";
import { TAG_DIMENSION_COLORS } from "@/types/tags";

interface AiSuggestionsQueueProps {
  suggestions: AiTagSuggestion[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onBulkAccept: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
}

function getConfidenceColor(score: number): string {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function getConfidenceBg(score: number): string {
  if (score >= 70) return "bg-emerald-500/10";
  if (score >= 50) return "bg-amber-500/10";
  return "bg-red-500/10";
}

export function AiSuggestionsQueue({
  suggestions,
  onAccept,
  onReject,
  onBulkAccept,
  onBulkReject,
}: AiSuggestionsQueueProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending");
  const allSelected =
    pendingSuggestions.length > 0 && pendingSuggestions.every((s) => selectedIds.has(s.id));
  const someSelected = pendingSuggestions.some((s) => selectedIds.has(s.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingSuggestions.map((s) => s.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkAccept = () => {
    onBulkAccept(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    onBulkReject(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Tag Suggestions
            {pendingSuggestions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingSuggestions.length}
              </Badge>
            )}
          </CardTitle>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedIds.size} selected
              </span>
              <Button size="sm" variant="outline" onClick={handleBulkAccept} className="h-7 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={handleBulkReject} className="h-7 text-xs">
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pendingSuggestions.length === 0 ? (
          <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
            No pending tag suggestions.
          </div>
        ) : (
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected || (someSelected && "indeterminate")}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Suggested Tag</TableHead>
                  <TableHead className="hidden sm:table-cell">Confidence</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSuggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(suggestion.id)}
                        onCheckedChange={() => toggleOne(suggestion.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{suggestion.productName}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn(
                                "cursor-help",
                                TAG_DIMENSION_COLORS[suggestion.suggestedTag.dimension]
                              )}
                            >
                              {suggestion.suggestedTag.tagName}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {TAG_DIMENSION_LABELS[suggestion.suggestedTag.dimension]}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {suggestion.reason}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          getConfidenceColor(suggestion.confidence),
                          getConfidenceBg(suggestion.confidence)
                        )}
                      >
                        {suggestion.confidence}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {suggestion.source}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                onClick={() => onAccept(suggestion.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Accept suggestion</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => onReject(suggestion.id)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reject suggestion</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
