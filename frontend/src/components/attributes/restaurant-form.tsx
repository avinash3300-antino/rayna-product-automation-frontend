"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
  MapPin,
  Clock,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RestaurantAttributes } from "@/types/attributes";
import { ATTRIBUTE_DESTINATIONS } from "@/types/attributes";

const TAG_DIMENSION_COLORS: Record<string, string> = {
  budget_tier: "bg-emerald-100 text-emerald-700 border-emerald-200",
  travel_theme: "bg-blue-100 text-blue-700 border-blue-200",
  audience: "bg-purple-100 text-purple-700 border-purple-200",
  season: "bg-amber-100 text-amber-700 border-amber-200",
  accessibility: "bg-rose-100 text-rose-700 border-rose-200",
};

interface RestaurantFormProps {
  attributes: RestaurantAttributes;
  editMode: boolean;
  onChange: (attrs: RestaurantAttributes) => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-gold" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

export function RestaurantForm({
  attributes,
  editMode,
  onChange,
}: RestaurantFormProps) {
  const update = (partial: Partial<RestaurantAttributes>) => {
    onChange({ ...attributes, ...partial });
  };

  const updateSchedule = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const hours = [...attributes.operatingHours];
    hours[index] = { ...hours[index], [field]: value };
    update({ operatingHours: hours });
  };

  return (
    <div className="space-y-3">
      {/* Basic Info */}
      <Section
        title="BASIC INFO"
        icon={<UtensilsCrossed className="h-4 w-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">
              Restaurant Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={attributes.restaurantName}
              onChange={(e) => update({ restaurantName: e.target.value })}
              disabled={!editMode}
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">
              Cuisine Type <span className="text-red-500">*</span>
            </Label>
            <Input
              value={attributes.cuisineType}
              onChange={(e) => update({ cuisineType: e.target.value })}
              disabled={!editMode}
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Price Range</Label>
            <Select
              value={attributes.priceRange}
              onValueChange={(val) => update({ priceRange: val })}
              disabled={!editMode}
            >
              <SelectTrigger className="mt-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ — Budget</SelectItem>
                <SelectItem value="$$">$$ — Moderate</SelectItem>
                <SelectItem value="$$$">$$$ — Upscale</SelectItem>
                <SelectItem value="$$$$">$$$$ — Fine Dining</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Location */}
      <Section title="LOCATION" icon={<MapPin className="h-4 w-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs font-medium">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              value={attributes.address}
              onChange={(e) => update({ address: e.target.value })}
              disabled={!editMode}
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Latitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={attributes.latitude}
              onChange={(e) =>
                update({ latitude: parseFloat(e.target.value) || 0 })
              }
              disabled={!editMode}
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Longitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={attributes.longitude}
              onChange={(e) =>
                update({ longitude: parseFloat(e.target.value) || 0 })
              }
              disabled={!editMode}
              className="mt-1 h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">
              Destination <span className="text-red-500">*</span>
            </Label>
            <Select
              value={attributes.destination}
              onValueChange={(val) => update({ destination: val })}
              disabled={!editMode}
            >
              <SelectTrigger className="mt-1 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ATTRIBUTE_DESTINATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Operating Hours */}
      <Section title="OPERATING HOURS" icon={<Clock className="h-4 w-4" />}>
        <div className="space-y-2">
          {attributes.operatingHours.map((schedule, index) => (
            <div
              key={schedule.day}
              className={`flex items-center gap-3 p-2 rounded-md ${
                schedule.closed ? "bg-muted/30 opacity-60" : ""
              }`}
            >
              <span className="text-xs font-medium w-20">{schedule.day}</span>
              <Input
                type="time"
                value={schedule.openTime}
                onChange={(e) =>
                  updateSchedule(index, "openTime", e.target.value)
                }
                disabled={!editMode || schedule.closed}
                className="h-8 text-xs w-28"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="time"
                value={schedule.closeTime}
                onChange={(e) =>
                  updateSchedule(index, "closeTime", e.target.value)
                }
                disabled={!editMode || schedule.closed}
                className="h-8 text-xs w-28"
              />
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[10px] text-muted-foreground">
                  Closed
                </span>
                <Switch
                  checked={schedule.closed}
                  onCheckedChange={(checked) =>
                    updateSchedule(index, "closed", checked)
                  }
                  disabled={!editMode}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tags */}
      <Section title="TAGS" icon={<Tag className="h-4 w-4" />} defaultOpen={false}>
        <div className="space-y-2">
          {attributes.tags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No tags assigned
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {attributes.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`text-[11px] ${
                    TAG_DIMENSION_COLORS[tag.dimension] || ""
                  }`}
                >
                  {tag.value}
                </Badge>
              ))}
            </div>
          )}
          <button className="text-xs text-blue-500 hover:underline">
            Manage Tags →
          </button>
        </div>
      </Section>
    </div>
  );
}
