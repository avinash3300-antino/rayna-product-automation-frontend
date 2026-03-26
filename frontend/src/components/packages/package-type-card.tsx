"use client";

import {
  Building2,
  Waves,
  Mountain,
  Landmark,
  Users,
  Crown,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { PackageTypeDefinition } from "@/types/packages";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Waves,
  Mountain,
  Landmark,
  Users,
  Crown,
  Puzzle,
};

interface PackageTypeCardProps {
  typeDef: PackageTypeDefinition;
  isSelected: boolean;
  onSelect: () => void;
}

export function PackageTypeCard({
  typeDef,
  isSelected,
  onSelect,
}: PackageTypeCardProps) {
  const Icon = ICON_MAP[typeDef.icon] || Puzzle;

  const rules = typeDef.componentRules;
  const dur = typeDef.durationConstraint;

  const rulesSummary = [
    rules.hotels.min > 0
      ? `${rules.hotels.min}${rules.hotels.max > rules.hotels.min ? `-${rules.hotels.max}` : ""} Hotel${rules.hotels.max > 1 ? "s" : ""}`
      : null,
    rules.attractions.min > 0
      ? `${rules.attractions.min}-${rules.attractions.max} Attractions`
      : null,
    rules.transfers.min > 0
      ? `${rules.transfers.min}${rules.transfers.max > rules.transfers.min ? `-${rules.transfers.max}` : ""} Transfer${rules.transfers.max > 1 ? "s" : ""}`
      : null,
    `${dur.minNights}-${dur.maxNights} Nights`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected
          ? "border-gold ring-2 ring-gold/20 bg-gold/5"
          : "hover:border-muted-foreground/30"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              isSelected
                ? "bg-gold/20 text-gold-dark"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">{typeDef.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {typeDef.description}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1.5 font-medium">
              {rulesSummary}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
