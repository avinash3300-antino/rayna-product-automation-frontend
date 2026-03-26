"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Car,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  FileText,
  Tags,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  TransferAttributes,
  TransferType,
  VehicleType,
  PricingModel,
} from "@/types/attributes";
import { CURRENCY_CODES } from "@/types/attributes";
import type { TagDimension } from "@/types/products";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TransferFormProps {
  attributes: TransferAttributes;
  editMode: boolean;
  onChange: (attrs: TransferAttributes) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TRANSFER_TYPES: TransferType[] = [
  "Airport",
  "City",
  "Intercity",
  "Port",
  "Custom",
];

const VEHICLE_TYPES: VehicleType[] = [
  "Sedan",
  "Van",
  "Minibus",
  "Coach",
  "Luxury",
];

const PRICING_MODELS: PricingModel[] = ["Per Vehicle", "Per Person"];

const TAG_DIMENSION_COLORS: Record<TagDimension, string> = {
  budget_tier: "bg-emerald-900/40 text-emerald-300 border-emerald-500/30",
  travel_theme: "bg-blue-900/40 text-blue-300 border-blue-500/30",
  audience: "bg-purple-900/40 text-purple-300 border-purple-500/30",
  season: "bg-amber-900/40 text-amber-300 border-amber-500/30",
  accessibility: "bg-rose-900/40 text-rose-300 border-rose-500/30",
};

const TAG_DIMENSION_LABELS: Record<TagDimension, string> = {
  budget_tier: "Budget Tier",
  travel_theme: "Travel Theme",
  audience: "Audience",
  season: "Season",
  accessibility: "Accessibility",
};

/** Tiny required-field asterisk */
function RequiredMark() {
  return <span className="ml-0.5 text-red-400">*</span>;
}

// ---------------------------------------------------------------------------
// Section wrapper (accordion)
// ---------------------------------------------------------------------------

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({
  icon,
  title,
  summary,
  open,
  onToggle,
  children,
}: SectionProps) {
  return (
    <div className="rounded-lg border border-gold/30 bg-navy-light overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-navy-dark/40"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-gold" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-gold" />
        )}
        <span className="text-gold">{icon}</span>
        <span className="font-semibold text-sm text-white">{title}</span>
        {!open && (
          <span className="ml-auto truncate text-xs text-gray-400">
            {summary}
          </span>
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gold/10 bg-navy-dark/20 px-4 py-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TransferForm({
  attributes,
  editMode,
  onChange,
}: TransferFormProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    route: false,
    vehicle: false,
    pricing: false,
    features: false,
    seo: false,
    tags: false,
  });

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Convenience updater
  const update = <K extends keyof TransferAttributes>(
    key: K,
    value: TransferAttributes[K]
  ) => {
    onChange({ ...attributes, [key]: value });
  };

  // ------- Summaries for collapsed sections -------
  const basicSummary = [attributes.transferName, attributes.transferType]
    .filter(Boolean)
    .join(" - ");

  const routeSummary = [
    attributes.originLocation,
    attributes.destinationLocation,
  ]
    .filter(Boolean)
    .join(" -> ");

  const vehicleSummary = [
    attributes.vehicleType,
    attributes.pricingModel,
    attributes.minPax || attributes.maxPax
      ? `${attributes.minPax}-${attributes.maxPax} pax`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const pricingSummary =
    attributes.netRate > 0
      ? `${attributes.currencyCode} ${attributes.netRate}`
      : "Not set";

  const featureSummary = [
    attributes.meetAndGreet && "Meet & Greet",
    attributes.availability247 && "24/7",
    attributes.flightMonitoring && "Flight Mon.",
  ]
    .filter(Boolean)
    .join(", ") || "None";

  const seoSummary = attributes.shortDescription
    ? `${attributes.shortDescription.slice(0, 60)}...`
    : "No description";

  const tagsSummary =
    attributes.tags.length > 0
      ? `${attributes.tags.length} tag${attributes.tags.length > 1 ? "s" : ""}`
      : "No tags";

  // Group tags by dimension
  const tagsByDimension = attributes.tags.reduce(
    (acc, tag) => {
      if (!acc[tag.dimension]) acc[tag.dimension] = [];
      acc[tag.dimension].push(tag.value);
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <div className="space-y-3">
      {/* ============================================================= */}
      {/* 1. BASIC INFO                                                  */}
      {/* ============================================================= */}
      <Section
        id="basic"
        icon={<Car className="h-4 w-4" />}
        title="Basic Info"
        summary={basicSummary}
        open={!!openSections.basic}
        onToggle={() => toggle("basic")}
      >
        {/* Transfer Name / Route */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Transfer Name / Route
            <RequiredMark />
          </Label>
          <Input
            value={attributes.transferName}
            disabled={!editMode}
            placeholder="e.g. DXB Airport to JBR"
            onChange={(e) => update("transferName", e.target.value)}
            className="bg-navy border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Transfer Type */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Transfer Type
            <RequiredMark />
          </Label>
          <Select
            value={attributes.transferType}
            disabled={!editMode}
            onValueChange={(v) => update("transferType", v as TransferType)}
          >
            <SelectTrigger className="bg-navy border-gray-600 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-navy-light border-gray-600">
              {TRANSFER_TYPES.map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                  className="text-white focus:bg-navy-dark focus:text-gold"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* ============================================================= */}
      {/* 2. ROUTE                                                       */}
      {/* ============================================================= */}
      <Section
        id="route"
        icon={<MapPin className="h-4 w-4" />}
        title="Route"
        summary={routeSummary}
        open={!!openSections.route}
        onToggle={() => toggle("route")}
      >
        {/* Origin Location */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Origin Location
            <RequiredMark />
          </Label>
          <Input
            value={attributes.originLocation}
            disabled={!editMode}
            placeholder="e.g. Dubai International Airport (DXB)"
            onChange={(e) => update("originLocation", e.target.value)}
            className="bg-navy border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Destination Location */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Destination Location
            <RequiredMark />
          </Label>
          <Input
            value={attributes.destinationLocation}
            disabled={!editMode}
            placeholder="e.g. JBR, Dubai Marina"
            onChange={(e) => update("destinationLocation", e.target.value)}
            className="bg-navy border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Typical Duration */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Typical Duration
            <RequiredMark />
          </Label>
          <Input
            value={attributes.typicalDuration}
            disabled={!editMode}
            placeholder='e.g. 25-40 min'
            onChange={(e) => update("typicalDuration", e.target.value)}
            className="bg-navy border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>
      </Section>

      {/* ============================================================= */}
      {/* 3. VEHICLE & CAPACITY                                          */}
      {/* ============================================================= */}
      <Section
        id="vehicle"
        icon={<Users className="h-4 w-4" />}
        title="Vehicle & Capacity"
        summary={vehicleSummary}
        open={!!openSections.vehicle}
        onToggle={() => toggle("vehicle")}
      >
        {/* Vehicle Type */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Vehicle Type
            <RequiredMark />
          </Label>
          <Select
            value={attributes.vehicleType}
            disabled={!editMode}
            onValueChange={(v) => update("vehicleType", v as VehicleType)}
          >
            <SelectTrigger className="bg-navy border-gray-600 text-white">
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent className="bg-navy-light border-gray-600">
              {VEHICLE_TYPES.map((v) => (
                <SelectItem
                  key={v}
                  value={v}
                  className="text-white focus:bg-navy-dark focus:text-gold"
                >
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min / Max Pax */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-xs">
              Min Pax
              <RequiredMark />
            </Label>
            <Input
              type="number"
              min={0}
              value={attributes.minPax}
              disabled={!editMode}
              onChange={(e) => update("minPax", Number(e.target.value))}
              className="bg-navy border-gray-600 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-xs">
              Max Pax
              <RequiredMark />
            </Label>
            <Input
              type="number"
              min={0}
              value={attributes.maxPax}
              disabled={!editMode}
              onChange={(e) => update("maxPax", Number(e.target.value))}
              className="bg-navy border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Pricing Model */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Pricing Model
            <RequiredMark />
          </Label>
          <Select
            value={attributes.pricingModel}
            disabled={!editMode}
            onValueChange={(v) => update("pricingModel", v as PricingModel)}
          >
            <SelectTrigger className="bg-navy border-gray-600 text-white">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-navy-light border-gray-600">
              {PRICING_MODELS.map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                  className="text-white focus:bg-navy-dark focus:text-gold"
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* ============================================================= */}
      {/* 4. PRICING                                                     */}
      {/* ============================================================= */}
      <Section
        id="pricing"
        icon={<DollarSign className="h-4 w-4" />}
        title="Pricing"
        summary={pricingSummary}
        open={!!openSections.pricing}
        onToggle={() => toggle("pricing")}
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Net Rate */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-xs">
              Net Rate
              <RequiredMark />
            </Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={attributes.netRate}
              disabled={!editMode}
              onChange={(e) => update("netRate", Number(e.target.value))}
              className="bg-navy border-gray-600 text-white"
            />
          </div>

          {/* Currency Code */}
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-xs">
              Currency Code
              <RequiredMark />
            </Label>
            <Select
              value={attributes.currencyCode}
              disabled={!editMode}
              onValueChange={(v) => update("currencyCode", v)}
            >
              <SelectTrigger className="bg-navy border-gray-600 text-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="bg-navy-light border-gray-600">
                {CURRENCY_CODES.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="text-white focus:bg-navy-dark focus:text-gold"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* ============================================================= */}
      {/* 5. FEATURES                                                    */}
      {/* ============================================================= */}
      <Section
        id="features"
        icon={<Sparkles className="h-4 w-4" />}
        title="Features"
        summary={featureSummary}
        open={!!openSections.features}
        onToggle={() => toggle("features")}
      >
        {/* Meet & Greet */}
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 text-sm">Meet & Greet Included</Label>
          <Switch
            checked={attributes.meetAndGreet}
            disabled={!editMode}
            onCheckedChange={(v) => update("meetAndGreet", v)}
            className="data-[state=checked]:bg-gold"
          />
        </div>

        {/* 24/7 Availability */}
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 text-sm">24/7 Availability</Label>
          <Switch
            checked={attributes.availability247}
            disabled={!editMode}
            onCheckedChange={(v) => update("availability247", v)}
            className="data-[state=checked]:bg-gold"
          />
        </div>

        {/* Flight Monitoring - only when Airport transfer */}
        {attributes.transferType === "Airport" && (
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm">Flight Monitoring</Label>
            <Switch
              checked={attributes.flightMonitoring}
              disabled={!editMode}
              onCheckedChange={(v) => update("flightMonitoring", v)}
              className="data-[state=checked]:bg-gold"
            />
          </div>
        )}
      </Section>

      {/* ============================================================= */}
      {/* 6. SEO CONTENT                                                 */}
      {/* ============================================================= */}
      <Section
        id="seo"
        icon={<FileText className="h-4 w-4" />}
        title="SEO Content"
        summary={seoSummary}
        open={!!openSections.seo}
        onToggle={() => toggle("seo")}
      >
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">Short Description</Label>
          <Textarea
            value={attributes.shortDescription}
            disabled={!editMode}
            rows={4}
            placeholder="Brief description of the transfer service..."
            onChange={(e) => update("shortDescription", e.target.value)}
            className="bg-navy border-gray-600 text-white placeholder:text-gray-500 resize-none"
          />
        </div>
      </Section>

      {/* ============================================================= */}
      {/* 7. TAGS                                                        */}
      {/* ============================================================= */}
      <Section
        id="tags"
        icon={<Tags className="h-4 w-4" />}
        title="Tags"
        summary={tagsSummary}
        open={!!openSections.tags}
        onToggle={() => toggle("tags")}
      >
        {attributes.tags.length === 0 ? (
          <p className="text-xs text-gray-500 italic">
            No tags assigned yet.
          </p>
        ) : (
          <div className="space-y-3">
            {(
              Object.entries(tagsByDimension) as [TagDimension, string[]][]
            ).map(([dimension, values]) => (
              <div key={dimension} className="space-y-1.5">
                <span className="text-xs font-medium text-gray-400">
                  {TAG_DIMENSION_LABELS[dimension] ?? dimension}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((value) => (
                    <Badge
                      key={`${dimension}-${value}`}
                      variant="outline"
                      className={`text-xs ${TAG_DIMENSION_COLORS[dimension] ?? "bg-gray-800 text-gray-300 border-gray-600"}`}
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manage Tags link */}
        <div className="pt-2 border-t border-gold/10">
          <button
            type="button"
            disabled={!editMode}
            className="text-xs text-gold hover:text-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Manage Tags &rarr;
          </button>
        </div>
      </Section>
    </div>
  );
}
