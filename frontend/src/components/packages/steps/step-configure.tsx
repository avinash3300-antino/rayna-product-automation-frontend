"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DESTINATIONS, PACKAGE_TYPE_DEFINITIONS } from "@/lib/mock-packages";
import type { PackageTypeId } from "@/types/packages";

interface StepConfigureProps {
  packageName: string;
  packageTypeId: PackageTypeId | null;
  destination: string;
  nights: number;
  onPackageNameChange: (name: string) => void;
  onDestinationChange: (dest: string) => void;
  onNightsChange: (nights: number) => void;
}

export function StepConfigure({
  packageName,
  packageTypeId,
  destination,
  nights,
  onPackageNameChange,
  onDestinationChange,
  onNightsChange,
}: StepConfigureProps) {
  const typeDef = PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === packageTypeId);
  const dur = typeDef?.durationConstraint;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Package Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Package Type (read-only display) */}
        <div className="space-y-2">
          <Label>Package Type</Label>
          {typeDef ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gold/10 text-gold-dark border-gold/30">
                {typeDef.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {typeDef.description}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a package type from the left panel
            </p>
          )}
        </div>

        {/* Package Name */}
        <div className="space-y-2">
          <Label htmlFor="pkg-name">Package Name</Label>
          <Input
            id="pkg-name"
            value={packageName}
            onChange={(e) => onPackageNameChange(e.target.value)}
            placeholder="e.g. Dubai City Explorer"
          />
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select value={destination || "placeholder"} onValueChange={(val) => val !== "placeholder" && onDestinationChange(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {DESTINATIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="pkg-nights">
            Duration
            {dur && (
              <span className="text-xs text-muted-foreground font-normal ml-2">
                ({dur.minNights}–{dur.maxNights} nights allowed)
              </span>
            )}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="pkg-nights"
              type="number"
              min={dur?.minNights ?? 1}
              max={dur?.maxNights ?? 14}
              value={nights}
              onChange={(e) => onNightsChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">nights</span>
            <span className="text-sm font-medium">=</span>
            <span className="text-sm font-medium">{nights + 1} days</span>
          </div>
          {dur && (nights < dur.minNights || nights > dur.maxNights) && (
            <p className="text-xs text-destructive">
              Must be between {dur.minNights} and {dur.maxNights} nights for {typeDef?.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
