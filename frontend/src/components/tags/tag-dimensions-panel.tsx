"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  DollarSign,
  Compass,
  Users,
  CalendarDays,
  Accessibility,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TAG_DIMENSION_LABELS } from "@/types/products";
import type { TagDimension } from "@/types/products";
import type { Tag } from "@/types/tags";
import { TagTreeNode } from "./tag-tree-node";

interface TagDimensionsPanelProps {
  tagTree: Record<TagDimension, Tag[]>;
  onAddTag: (dimension: TagDimension) => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  onAddChild: (parentTag: Tag) => void;
}

const DIMENSION_ICONS: Record<TagDimension, React.ElementType> = {
  budget_tier: DollarSign,
  travel_theme: Compass,
  audience: Users,
  season: CalendarDays,
  accessibility: Accessibility,
};

const DIMENSION_ORDER: TagDimension[] = [
  "budget_tier",
  "travel_theme",
  "audience",
  "season",
  "accessibility",
];

export function TagDimensionsPanel({
  tagTree,
  onAddTag,
  onEditTag,
  onDeleteTag,
  onAddChild,
}: TagDimensionsPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    budget_tier: true,
    travel_theme: true,
    audience: true,
    season: false,
    accessibility: false,
  });

  const toggleSection = (dim: string) => {
    setExpanded((prev) => ({ ...prev, [dim]: !prev[dim] }));
  };

  // Count all tags (including children) in a dimension
  const countTags = (tags: Tag[]): number => {
    let count = 0;
    for (const tag of tags) {
      count += 1;
      if (tag.children) count += countTags(tag.children);
    }
    return count;
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {DIMENSION_ORDER.map((dim) => {
          const Icon = DIMENSION_ICONS[dim];
          const tags = tagTree[dim] || [];
          const total = countTags(tags);
          const isExpanded = expanded[dim];

          return (
            <div key={dim}>
              <button
                onClick={() => toggleSection(dim)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                  isExpanded && "text-foreground",
                  !isExpanded && "text-muted-foreground"
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{TAG_DIMENSION_LABELS[dim]}</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {total}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTag(dim);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </button>

              {isExpanded && (
                <div className="ml-2 border-l pl-1">
                  {tags.length === 0 ? (
                    <p className="px-4 py-2 text-xs text-muted-foreground italic">
                      No tags yet
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <TagTreeNode
                        key={tag.id}
                        tag={tag}
                        level={0}
                        onEdit={onEditTag}
                        onDelete={onDeleteTag}
                        onAddChild={onAddChild}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
