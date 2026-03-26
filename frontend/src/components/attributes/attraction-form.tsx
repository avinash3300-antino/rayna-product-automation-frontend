"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Ticket,
  Image as ImageIcon,
  FileText,
  Tags,
  Plus,
  X,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type {
  AttractionAttributes,
  AttractionCategory,
  TicketType,
  TicketTypeEntry,
  DaySchedule,
  ImageEntry,
  ContentStatus,
} from "@/types/attributes";
import { ATTRIBUTE_DESTINATIONS, CURRENCY_CODES } from "@/types/attributes";
import type { TagDimension } from "@/types/products";

// ---- Constants ----

const ATTRACTION_CATEGORIES: AttractionCategory[] = [
  "Theme Park",
  "Cultural",
  "Adventure",
  "Water",
  "Nature",
  "Entertainment",
];

const TICKET_TYPE_OPTIONS: TicketType[] = ["Adult", "Child", "Family", "Senior"];

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STALENESS_THRESHOLD_DAYS = 7;

const DIMENSION_COLORS: Record<TagDimension, string> = {
  budget_tier: "bg-emerald-900/40 text-emerald-400 border-emerald-500/30",
  travel_theme: "bg-blue-900/40 text-blue-400 border-blue-500/30",
  audience: "bg-purple-900/40 text-purple-400 border-purple-500/30",
  season: "bg-amber-900/40 text-amber-400 border-amber-500/30",
  accessibility: "bg-rose-900/40 text-rose-400 border-rose-500/30",
};

const DIMENSION_LABELS: Record<TagDimension, string> = {
  budget_tier: "Budget Tier",
  travel_theme: "Travel Theme",
  audience: "Audience",
  season: "Season",
  accessibility: "Accessibility",
};

const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  Draft: "bg-amber-900/40 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-900/40 text-emerald-400 border-emerald-500/30",
  "Needs Refresh": "bg-rose-900/40 text-rose-400 border-rose-500/30",
};

// ---- Props ----

interface AttractionFormProps {
  attributes: AttractionAttributes;
  editMode: boolean;
  onChange: (attrs: AttractionAttributes) => void;
}

// ---- Helper: generate unique ID ----

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ---- Section Accordion Wrapper ----

function SectionAccordion({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  summary,
  children,
}: {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gold/30 rounded-lg overflow-hidden bg-navy">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-navy-light hover:bg-navy-light/80 transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gold shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gold shrink-0" />
        )}
        <Icon className="h-4 w-4 text-gold shrink-0" />
        <span className="font-bold text-sm text-white">{title}</span>
        {!isOpen && summary && (
          <span className="ml-auto text-xs text-gray-400 truncate max-w-[300px]">
            {summary}
          </span>
        )}
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

// ---- Required Field Label ----

function RequiredLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm text-gray-300">
      {children}
      <span className="text-red-500 ml-0.5">*</span>
    </Label>
  );
}

// ---- Main Component ----

export function AttractionForm({ attributes, editMode, onChange }: AttractionFormProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    location: false,
    visit: false,
    hours: false,
    tickets: false,
    media: false,
    seo: false,
    tags: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ---- Updater helpers ----

  const update = (partial: Partial<AttractionAttributes>) => {
    onChange({ ...attributes, ...partial });
  };

  const updateSchedule = (index: number, partial: Partial<DaySchedule>) => {
    const updated = attributes.operatingHours.map((s, i) =>
      i === index ? { ...s, ...partial } : s
    );
    update({ operatingHours: updated });
  };

  const addTicketType = () => {
    const entry: TicketTypeEntry = {
      id: generateId(),
      type: "Adult",
      priceFrom: 0,
      priceTo: 0,
      currency: "AED",
    };
    update({ ticketTypes: [...attributes.ticketTypes, entry] });
  };

  const removeTicketType = (id: string) => {
    update({ ticketTypes: attributes.ticketTypes.filter((t) => t.id !== id) });
  };

  const updateTicketType = (id: string, partial: Partial<TicketTypeEntry>) => {
    update({
      ticketTypes: attributes.ticketTypes.map((t) =>
        t.id === id ? { ...t, ...partial } : t
      ),
    });
  };

  const addImage = () => {
    const entry: ImageEntry = { id: generateId(), url: "" };
    update({ images: [...attributes.images, entry] });
  };

  const removeImage = (id: string) => {
    update({ images: attributes.images.filter((img) => img.id !== id) });
  };

  const updateImage = (id: string, url: string) => {
    update({
      images: attributes.images.map((img) => (img.id === id ? { ...img, url } : img)),
    });
  };

  // ---- Staleness calculation ----

  const daysSinceVerified = (() => {
    if (!attributes.lastVerifiedDate) return null;
    const verified = new Date(attributes.lastVerifiedDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  })();

  const isStale = daysSinceVerified !== null && daysSinceVerified > STALENESS_THRESHOLD_DAYS;

  // ---- Summaries ----

  const basicSummary = [attributes.attractionName, attributes.category].filter(Boolean).join(" - ") || "Not configured";
  const locationSummary = attributes.address || "No address";
  const visitSummary = attributes.typicalDuration ? `Duration: ${attributes.typicalDuration}` : "Not configured";
  const hoursSummary = (() => {
    const openDays = attributes.operatingHours.filter((d) => !d.closed).length;
    return `${openDays}/7 days open`;
  })();
  const ticketsSummary = `${attributes.ticketTypes.length} ticket type${attributes.ticketTypes.length !== 1 ? "s" : ""}`;
  const mediaSummary = `${attributes.images.length} image${attributes.images.length !== 1 ? "s" : ""}`;
  const seoSummary = attributes.contentStatus || "No status";
  const tagsSummary = `${attributes.tags.length} tag${attributes.tags.length !== 1 ? "s" : ""}`;

  return (
    <div className="space-y-3">
      {/* ============ BASIC INFO ============ */}
      <SectionAccordion
        title="BASIC INFO"
        icon={Info}
        isOpen={openSections.basic}
        onToggle={() => toggleSection("basic")}
        summary={basicSummary}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel htmlFor="attractionName">Attraction Name</RequiredLabel>
            <Input
              id="attractionName"
              value={attributes.attractionName}
              disabled={!editMode}
              onChange={(e) => update({ attractionName: e.target.value })}
              placeholder="e.g. Burj Khalifa At the Top"
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel>Category</RequiredLabel>
            <Select
              value={attributes.category}
              onValueChange={(val) => update({ category: val as AttractionCategory })}
              disabled={!editMode}
            >
              <SelectTrigger className="bg-navy-dark border-gold/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ATTRACTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionAccordion>

      {/* ============ LOCATION ============ */}
      <SectionAccordion
        title="LOCATION"
        icon={MapPin}
        isOpen={openSections.location}
        onToggle={() => toggleSection("location")}
        summary={locationSummary}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <RequiredLabel htmlFor="address">Address</RequiredLabel>
            <Input
              id="address"
              value={attributes.address}
              disabled={!editMode}
              onChange={(e) => update({ address: e.target.value })}
              placeholder="Full address"
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <RequiredLabel htmlFor="latitude">Latitude</RequiredLabel>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={attributes.latitude}
                disabled={!editMode}
                onChange={(e) => update({ latitude: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 25.1972"
                className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel htmlFor="longitude">Longitude</RequiredLabel>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={attributes.longitude}
                disabled={!editMode}
                onChange={(e) => update({ longitude: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 55.2744"
                className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Destination</RequiredLabel>
              <Select
                value={attributes.destination}
                onValueChange={(val) => update({ destination: val })}
                disabled={!editMode}
              >
                <SelectTrigger className="bg-navy-dark border-gold/30 text-white">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {ATTRIBUTE_DESTINATIONS.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* ============ VISIT INFO ============ */}
      <SectionAccordion
        title="VISIT INFO"
        icon={Clock}
        isOpen={openSections.visit}
        onToggle={() => toggleSection("visit")}
        summary={visitSummary}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel htmlFor="typicalDuration">Typical Visit Duration</RequiredLabel>
            <Input
              id="typicalDuration"
              value={attributes.typicalDuration}
              disabled={!editMode}
              onChange={(e) => update({ typicalDuration: e.target.value })}
              placeholder='e.g. "2-3 hours"'
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <RequiredLabel htmlFor="minimumAge">Minimum Age</RequiredLabel>
            <Input
              id="minimumAge"
              type="number"
              min={0}
              value={attributes.minimumAge}
              disabled={!editMode}
              onChange={(e) => update({ minimumAge: parseInt(e.target.value) || 0 })}
              placeholder="0 = no restriction"
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">0 = no age restriction</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Includes</Label>
            <Textarea
              value={attributes.includesText}
              disabled={!editMode}
              onChange={(e) => update({ includesText: e.target.value })}
              placeholder="What is included with the ticket..."
              rows={3}
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Excludes</Label>
            <Textarea
              value={attributes.excludesText}
              disabled={!editMode}
              onChange={(e) => update({ excludesText: e.target.value })}
              placeholder="What is not included..."
              rows={3}
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500 resize-none"
            />
          </div>
        </div>
      </SectionAccordion>

      {/* ============ OPERATING HOURS ============ */}
      <SectionAccordion
        title="OPERATING HOURS"
        icon={Clock}
        isOpen={openSections.hours}
        onToggle={() => toggleSection("hours")}
        summary={hoursSummary}
      >
        {/* Staleness warning */}
        {isStale && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-900/30 border border-amber-500/40 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <div className="flex-1 text-sm text-amber-300">
              Operating hours were last verified{" "}
              <span className="font-semibold">{daysSinceVerified} days</span> ago. Threshold:{" "}
              {STALENESS_THRESHOLD_DAYS} days. Flag for review?
            </div>
            {editMode && (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-900/50 hover:text-amber-300 shrink-0"
                onClick={() => {
                  // flag for review - update the verified date to signal review needed
                }}
              >
                Flag for Review
              </Button>
            )}
          </div>
        )}

        {/* Day-by-day schedule */}
        <div className="space-y-2">
          {attributes.operatingHours.map((schedule, index) => (
            <div
              key={schedule.day}
              className="grid grid-cols-[120px_1fr_1fr_auto] gap-3 items-center"
            >
              <span className="text-sm text-gray-300 font-medium">
                {DAY_LABELS[index] ?? schedule.day}
              </span>
              <Input
                type="time"
                value={schedule.openTime}
                disabled={!editMode || schedule.closed}
                onChange={(e) => updateSchedule(index, { openTime: e.target.value })}
                className={`bg-navy-dark border-gold/30 text-white ${
                  schedule.closed ? "opacity-40" : ""
                }`}
              />
              <Input
                type="time"
                value={schedule.closeTime}
                disabled={!editMode || schedule.closed}
                onChange={(e) => updateSchedule(index, { closeTime: e.target.value })}
                className={`bg-navy-dark border-gold/30 text-white ${
                  schedule.closed ? "opacity-40" : ""
                }`}
              />
              <div className="flex items-center gap-2 min-w-[100px]">
                <Switch
                  checked={schedule.closed}
                  onCheckedChange={(checked) => updateSchedule(index, { closed: checked })}
                  disabled={!editMode}
                />
                <span className="text-xs text-gray-400">Closed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Last verified date */}
        {attributes.lastVerifiedDate && (
          <p className="text-xs text-gray-500 mt-2">
            Last verified: {new Date(attributes.lastVerifiedDate).toLocaleDateString()}
          </p>
        )}
      </SectionAccordion>

      {/* ============ TICKET TYPES ============ */}
      <SectionAccordion
        title="TICKET TYPES"
        icon={Ticket}
        isOpen={openSections.tickets}
        onToggle={() => toggleSection("tickets")}
        summary={ticketsSummary}
      >
        {/* Validation error */}
        {attributes.ticketTypes.length === 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-500/40 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span className="text-sm text-red-300">
              At least 1 ticket type is required.
            </span>
          </div>
        )}

        {/* Table */}
        {attributes.ticketTypes.length > 0 && (
          <div className="rounded-lg overflow-hidden border border-gold/30">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2 bg-navy-light">
              <span className="text-xs font-semibold text-gold">Type</span>
              <span className="text-xs font-semibold text-gold">Price From</span>
              <span className="text-xs font-semibold text-gold">Price To</span>
              <span className="text-xs font-semibold text-gold">Currency</span>
              <span className="w-8" />
            </div>
            {/* Rows */}
            {attributes.ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2 border-t border-gold/10 items-center"
              >
                <Select
                  value={ticket.type}
                  onValueChange={(val) =>
                    updateTicketType(ticket.id, { type: val as TicketType })
                  }
                  disabled={!editMode}
                >
                  <SelectTrigger className="bg-navy-dark border-gold/30 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_TYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={ticket.priceFrom}
                  disabled={!editMode}
                  onChange={(e) =>
                    updateTicketType(ticket.id, {
                      priceFrom: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-navy-dark border-gold/30 text-white h-8 text-sm"
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={ticket.priceTo}
                  disabled={!editMode}
                  onChange={(e) =>
                    updateTicketType(ticket.id, {
                      priceTo: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-navy-dark border-gold/30 text-white h-8 text-sm"
                />
                <Select
                  value={ticket.currency}
                  onValueChange={(val) => updateTicketType(ticket.id, { currency: val })}
                  disabled={!editMode}
                >
                  <SelectTrigger className="bg-navy-dark border-gold/30 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_CODES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editMode && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                    onClick={() => removeTicketType(ticket.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {!editMode && <span className="w-8" />}
              </div>
            ))}
          </div>
        )}

        {/* Add button */}
        {editMode && (
          <Button
            size="sm"
            variant="outline"
            onClick={addTicketType}
            className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Ticket Type
          </Button>
        )}
      </SectionAccordion>

      {/* ============ MEDIA ============ */}
      <SectionAccordion
        title="MEDIA"
        icon={ImageIcon}
        isOpen={openSections.media}
        onToggle={() => toggleSection("media")}
        summary={mediaSummary}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-300">Images</span>
          <Badge
            variant="outline"
            className={`text-xs ${
              attributes.images.length >= 5
                ? "border-emerald-500/50 text-emerald-400"
                : "border-red-500/50 text-red-400"
            }`}
          >
            {attributes.images.length} / 5 min
          </Badge>
        </div>

        <div className="space-y-2">
          {attributes.images.map((img) => (
            <div key={img.id} className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="h-12 w-12 rounded-md overflow-hidden bg-navy-dark border border-gold/20 shrink-0 flex items-center justify-center">
                {img.url ? (
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <Input
                value={img.url}
                disabled={!editMode}
                onChange={(e) => updateImage(img.id, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500 flex-1"
              />
              {editMode && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30 shrink-0"
                  onClick={() => removeImage(img.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <Button
            size="sm"
            variant="outline"
            onClick={addImage}
            className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        )}
      </SectionAccordion>

      {/* ============ SEO CONTENT ============ */}
      <SectionAccordion
        title="SEO CONTENT"
        icon={FileText}
        isOpen={openSections.seo}
        onToggle={() => toggleSection("seo")}
        summary={seoSummary}
      >
        <div className="space-y-4">
          {/* Short Description (read-only) */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Short Description</Label>
            <Textarea
              value={attributes.shortDescription}
              disabled
              rows={3}
              className="bg-navy-dark border-gold/30 text-gray-400 resize-none opacity-70"
            />
            <p className="text-xs text-gray-500">Auto-generated. Read-only.</p>
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaTitle" className="text-sm text-gray-300">
                Meta Title
              </Label>
              <span
                className={`text-xs ${
                  attributes.metaTitle.length > 60 ? "text-red-400" : "text-gray-500"
                }`}
              >
                {attributes.metaTitle.length}/60
              </span>
            </div>
            <Input
              id="metaTitle"
              value={attributes.metaTitle}
              disabled={!editMode}
              maxLength={60}
              onChange={(e) => update({ metaTitle: e.target.value })}
              placeholder="SEO meta title"
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaDescription" className="text-sm text-gray-300">
                Meta Description
              </Label>
              <span
                className={`text-xs ${
                  attributes.metaDescription.length > 160 ? "text-red-400" : "text-gray-500"
                }`}
              >
                {attributes.metaDescription.length}/160
              </span>
            </div>
            <Textarea
              id="metaDescription"
              value={attributes.metaDescription}
              disabled={!editMode}
              maxLength={160}
              onChange={(e) => update({ metaDescription: e.target.value })}
              placeholder="SEO meta description"
              rows={2}
              className="bg-navy-dark border-gold/30 text-white placeholder:text-gray-500 resize-none"
            />
          </div>

          {/* Content Status */}
          <div className="flex items-center gap-3">
            <Label className="text-sm text-gray-300">Content Status</Label>
            <Badge
              variant="outline"
              className={
                CONTENT_STATUS_COLORS[attributes.contentStatus] ??
                "border-gray-500 text-gray-400"
              }
            >
              {attributes.contentStatus}
            </Badge>
          </div>
        </div>
      </SectionAccordion>

      {/* ============ TAGS ============ */}
      <SectionAccordion
        title="TAGS"
        icon={Tags}
        isOpen={openSections.tags}
        onToggle={() => toggleSection("tags")}
        summary={tagsSummary}
      >
        {attributes.tags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags assigned.</p>
        ) : (
          <div className="space-y-3">
            {(
              Object.keys(DIMENSION_LABELS) as TagDimension[]
            ).map((dimension) => {
              const dimensionTags = attributes.tags.filter((t) => t.dimension === dimension);
              if (dimensionTags.length === 0) return null;
              return (
                <div key={dimension} className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {DIMENSION_LABELS[dimension]}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dimensionTags.map((tag, idx) => (
                      <Badge
                        key={`${tag.dimension}-${tag.value}-${idx}`}
                        variant="outline"
                        className={DIMENSION_COLORS[dimension]}
                      >
                        {tag.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <a
          href="#"
          className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors mt-2"
        >
          Manage Tags
          <ExternalLink className="h-3 w-3" />
        </a>
      </SectionAccordion>
    </div>
  );
}
