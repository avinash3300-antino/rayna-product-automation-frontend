"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TAG_DIMENSION_LABELS } from "@/types/products";
import type { TagDimension } from "@/types/products";
import type { Tag } from "@/types/tags";
import { TAG_DIMENSION_COLORS } from "@/types/tags";

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function TagSelector({ tags, selectedTagIds, onSelectionChange }: TagSelectorProps) {
  const [expandedDimensions, setExpandedDimensions] = useState<Record<string, boolean>>({
    budget_tier: true,
    travel_theme: true,
    audience: false,
    season: false,
    accessibility: false,
  });

  const dimensions = Object.keys(TAG_DIMENSION_LABELS) as TagDimension[];

  const toggleDimension = (dim: string) => {
    setExpandedDimensions((prev) => ({ ...prev, [dim]: !prev[dim] }));
  };

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onSelectionChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  // Flatten all tags (including children) for each dimension
  const getTagsForDimension = (dim: TagDimension): Tag[] => {
    return tags.filter((t) => t.dimension === dim);
  };

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium mb-2">
        Select Tags to Apply
        {selectedTagIds.length > 0 && (
          <span className="text-muted-foreground ml-1">({selectedTagIds.length} selected)</span>
        )}
      </p>
      <div className="rounded-md border p-2 max-h-[200px] overflow-auto space-y-2">
        {dimensions.map((dim) => {
          const dimTags = getTagsForDimension(dim);
          if (dimTags.length === 0) return null;

          return (
            <div key={dim}>
              <button
                onClick={() => toggleDimension(dim)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
              >
                {expandedDimensions[dim] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                {TAG_DIMENSION_LABELS[dim]}
              </button>

              {expandedDimensions[dim] && (
                <div className="flex flex-wrap gap-1.5 mt-1 ml-4">
                  {dimTags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer text-xs transition-colors",
                          isSelected
                            ? "bg-navy text-white hover:bg-navy-light"
                            : TAG_DIMENSION_COLORS[dim] + " hover:opacity-80"
                        )}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
