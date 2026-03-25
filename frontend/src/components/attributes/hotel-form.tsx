"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Star,
  MapPin,
  Building2,
  Clock,
  BedDouble,
  Sparkles,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Tags,
  Search,
  Plus,
  X,
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
import { Textarea } from "@/components/ui/textarea";

import type {
  HotelAttributes,
  PropertyType,
  CancellationPolicy,
  RoomType,
  BoardType,
  ContentStatus,
  ImageEntry,
} from "@/types/attributes";
import {
  MASTER_AMENITIES,
  CURRENCY_CODES,
  ATTRIBUTE_DESTINATIONS,
} from "@/types/attributes";

// ---- Props ----
interface HotelFormProps {
  attributes: HotelAttributes;
  editMode: boolean;
  onChange: (attrs: HotelAttributes) => void;
}

// ---- Constants ----
const PROPERTY_TYPES: PropertyType[] = [
  "Resort",
  "Hotel",
  "Boutique",
  "Apartment",
  "Villa",
  "Hostel",
  "Guesthouse",
];

const CANCELLATION_POLICIES: CancellationPolicy[] = [
  "Free",
  "Non-Refundable",
  "Partial",
];

const ALL_ROOM_TYPES: RoomType[] = ["Standard", "Deluxe", "Suite", "Family"];
const ALL_BOARD_TYPES: BoardType[] = ["RO", "BB", "HB", "FB", "AI"];

const AMENITY_GROUPS = ["Facilities", "Dining", "Connectivity", "Wellness"] as const;

const TAG_DIMENSION_COLORS: Record<string, string> = {
  budget_tier: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  travel_theme: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  audience: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  season: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  accessibility: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  Draft: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Needs Refresh": "bg-red-500/20 text-red-400 border-red-500/30",
};

// ---- Section type ----
type SectionId =
  | "basic"
  | "location"
  | "operations"
  | "roomBoard"
  | "amenities"
  | "pricing"
  | "media"
  | "seo"
  | "tags";

interface SectionMeta {
  id: SectionId;
  title: string;
  icon: React.ReactNode;
  requiredCount: number;
  getSummary: (attrs: HotelAttributes) => string;
}

// ---- Helper: required asterisk ----
function RequiredMark() {
  return <span className="text-red-400 ml-0.5">*</span>;
}

// ---- Main Component ----
export function HotelForm({
  attributes,
  editMode,
  onChange,
}: HotelFormProps) {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    new Set(["basic"])
  );
  const [amenitySearch, setAmenitySearch] = useState("");

  // Toggle section open/closed
  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Helper to update a field
  const update = <K extends keyof HotelAttributes>(
    field: K,
    value: HotelAttributes[K]
  ) => {
    onChange({ ...attributes, [field]: value });
  };

  // ---- Section definitions ----
  const sections: SectionMeta[] = useMemo(
    () => [
      {
        id: "basic",
        title: "Basic Info",
        icon: <Building2 className="w-4 h-4" />,
        requiredCount: 3,
        getSummary: (a) =>
          `${a.hotelName || "Unnamed"} - ${a.starRating}★ ${a.propertyType}`,
      },
      {
        id: "location",
        title: "Location",
        icon: <MapPin className="w-4 h-4" />,
        requiredCount: 4,
        getSummary: (a) =>
          `${a.address || "No address"} (${a.destination || "No destination"})`,
      },
      {
        id: "operations",
        title: "Operations",
        icon: <Clock className="w-4 h-4" />,
        requiredCount: 3,
        getSummary: (a) =>
          `Check-in ${a.checkInTime || "--:--"} / Check-out ${a.checkOutTime || "--:--"} - ${a.cancellationPolicy}`,
      },
      {
        id: "roomBoard",
        title: "Room & Board",
        icon: <BedDouble className="w-4 h-4" />,
        requiredCount: 2,
        getSummary: (a) =>
          `${a.roomTypes.length} room type(s), ${a.boardTypes.length} board type(s)`,
      },
      {
        id: "amenities",
        title: "Amenities",
        icon: <Sparkles className="w-4 h-4" />,
        requiredCount: 1,
        getSummary: (a) => `${a.amenities.length} amenities selected`,
      },
      {
        id: "pricing",
        title: "Pricing",
        icon: <DollarSign className="w-4 h-4" />,
        requiredCount: 2,
        getSummary: (a) =>
          `From ${a.currencyCode} ${a.netRateFrom || 0}`,
      },
      {
        id: "media",
        title: "Media",
        icon: <ImageIcon className="w-4 h-4" />,
        requiredCount: 1,
        getSummary: (a) => `${a.images.length} image(s)`,
      },
      {
        id: "seo",
        title: "SEO Content",
        icon: <FileText className="w-4 h-4" />,
        requiredCount: 2,
        getSummary: (a) =>
          `${a.contentStatus} - Meta title: ${a.metaTitle ? a.metaTitle.length : 0}/60`,
      },
      {
        id: "tags",
        title: "Tags",
        icon: <Tags className="w-4 h-4" />,
        requiredCount: 0,
        getSummary: (a) => `${a.tags.length} tag(s)`,
      },
    ],
    []
  );

  // ---- Filtered amenities ----
  const filteredAmenities = useMemo(() => {
    if (!amenitySearch.trim()) return MASTER_AMENITIES;
    const q = amenitySearch.toLowerCase();
    return MASTER_AMENITIES.filter((a) => a.name.toLowerCase().includes(q));
  }, [amenitySearch]);

  // Group filtered amenities by category
  const groupedAmenities = useMemo(() => {
    const groups: Record<string, typeof MASTER_AMENITIES> = {};
    for (const group of AMENITY_GROUPS) {
      const items = filteredAmenities.filter((a) => a.group === group);
      if (items.length > 0) {
        groups[group] = items;
      }
    }
    return groups;
  }, [filteredAmenities]);

  // ---- Section Header Component ----
  const renderSectionHeader = (section: SectionMeta) => {
    const isOpen = openSections.has(section.id);
    return (
      <button
        type="button"
        onClick={() => toggleSection(section.id)}
        className="w-full flex items-center justify-between px-5 py-4 bg-navy-light/50 hover:bg-navy-light transition-colors rounded-lg group"
      >
        <div className="flex items-center gap-3">
          <span className="text-gold">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          <span className="text-gold">{section.icon}</span>
          <span className="font-semibold text-white text-sm">
            {section.title}
          </span>
          {section.requiredCount > 0 && (
            <Badge className="bg-gold/10 text-gold border-gold/30 text-[10px] px-1.5 py-0">
              {section.requiredCount} required
            </Badge>
          )}
        </div>
        {!isOpen && (
          <span className="text-xs text-gray-400 truncate max-w-[300px]">
            {section.getSummary(attributes)}
          </span>
        )}
      </button>
    );
  };

  // ---- Section: Basic Info ----
  const renderBasicInfo = () => (
    <div className="space-y-4 p-5">
      {/* Hotel Name */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Hotel Name
          <RequiredMark />
        </Label>
        <Input
          value={attributes.hotelName}
          onChange={(e) => update("hotelName", e.target.value)}
          disabled={!editMode}
          placeholder="Enter hotel name"
          className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
        />
      </div>

      {/* Star Rating */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Star Rating
          <RequiredMark />
        </Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={!editMode}
              onClick={() => update("starRating", star)}
              className="p-0.5 transition-colors disabled:cursor-not-allowed"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= attributes.starRating
                    ? "fill-gold text-gold"
                    : "fill-transparent text-gray-600"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-400">
            {attributes.starRating}/5
          </span>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Property Type
          <RequiredMark />
        </Label>
        <Select
          value={attributes.propertyType}
          onValueChange={(v) => update("propertyType", v as PropertyType)}
          disabled={!editMode}
        >
          <SelectTrigger className="bg-navy-dark border-gold/20 text-white">
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent className="bg-navy border-gold/20">
            {PROPERTY_TYPES.map((pt) => (
              <SelectItem
                key={pt}
                value={pt}
                className="text-white hover:bg-navy-light focus:bg-navy-light focus:text-gold"
              >
                {pt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">Status</Label>
        <div>
          <Badge
            className={`capitalize ${
              attributes.status === "published"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : attributes.status === "draft"
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : attributes.status === "staged"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}
          >
            {attributes.status}
          </Badge>
        </div>
      </div>
    </div>
  );

  // ---- Section: Location ----
  const renderLocation = () => (
    <div className="space-y-4 p-5">
      {/* Address */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Address
          <RequiredMark />
        </Label>
        <Input
          value={attributes.address}
          onChange={(e) => update("address", e.target.value)}
          disabled={!editMode}
          placeholder="Enter full address"
          className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
        />
      </div>

      {/* Lat/Long */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Latitude
            <RequiredMark />
          </Label>
          <Input
            type="number"
            step="any"
            value={attributes.latitude || ""}
            onChange={(e) =>
              update("latitude", parseFloat(e.target.value) || 0)
            }
            disabled={!editMode}
            placeholder="e.g. 25.2048"
            className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Longitude
            <RequiredMark />
          </Label>
          <Input
            type="number"
            step="any"
            value={attributes.longitude || ""}
            onChange={(e) =>
              update("longitude", parseFloat(e.target.value) || 0)
            }
            disabled={!editMode}
            placeholder="e.g. 55.2708"
            className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
          />
        </div>
      </div>

      {/* Pick on Map placeholder */}
      {editMode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="btn-ghost-gold text-xs"
          onClick={() => {}}
        >
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          Pick on Map
        </Button>
      )}

      {/* Destination */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Destination
          <RequiredMark />
        </Label>
        <Select
          value={attributes.destination}
          onValueChange={(v) => update("destination", v)}
          disabled={!editMode}
        >
          <SelectTrigger className="bg-navy-dark border-gold/20 text-white">
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent className="bg-navy border-gold/20">
            {ATTRIBUTE_DESTINATIONS.map((d) => (
              <SelectItem
                key={d}
                value={d}
                className="text-white hover:bg-navy-light focus:bg-navy-light focus:text-gold"
              >
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // ---- Section: Operations ----
  const renderOperations = () => (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-2 gap-4">
        {/* Check-in Time */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Check-in Time
            <RequiredMark />
          </Label>
          <Input
            type="time"
            value={attributes.checkInTime}
            onChange={(e) => update("checkInTime", e.target.value)}
            disabled={!editMode}
            className="bg-navy-dark border-gold/20 text-white focus:border-gold/50"
          />
        </div>

        {/* Check-out Time */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Check-out Time
            <RequiredMark />
          </Label>
          <Input
            type="time"
            value={attributes.checkOutTime}
            onChange={(e) => update("checkOutTime", e.target.value)}
            disabled={!editMode}
            className="bg-navy-dark border-gold/20 text-white focus:border-gold/50"
          />
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">
          Cancellation Policy
          <RequiredMark />
        </Label>
        <Select
          value={attributes.cancellationPolicy}
          onValueChange={(v) =>
            update("cancellationPolicy", v as CancellationPolicy)
          }
          disabled={!editMode}
        >
          <SelectTrigger className="bg-navy-dark border-gold/20 text-white">
            <SelectValue placeholder="Select policy" />
          </SelectTrigger>
          <SelectContent className="bg-navy border-gold/20">
            {CANCELLATION_POLICIES.map((cp) => (
              <SelectItem
                key={cp}
                value={cp}
                className="text-white hover:bg-navy-light focus:bg-navy-light focus:text-gold"
              >
                {cp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // ---- Section: Room & Board ----
  const renderRoomBoard = () => {
    const toggleRoomType = (rt: RoomType) => {
      if (!editMode) return;
      const current = attributes.roomTypes;
      const updated = current.includes(rt)
        ? current.filter((r) => r !== rt)
        : [...current, rt];
      update("roomTypes", updated);
    };

    const toggleBoardType = (bt: BoardType) => {
      if (!editMode) return;
      const current = attributes.boardTypes;
      const updated = current.includes(bt)
        ? current.filter((b) => b !== bt)
        : [...current, bt];
      update("boardTypes", updated);
    };

    return (
      <div className="space-y-5 p-5">
        {/* Room Types */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">
            Room Types
            <RequiredMark />
          </Label>
          <div className="flex flex-wrap gap-2">
            {ALL_ROOM_TYPES.map((rt) => {
              const selected = attributes.roomTypes.includes(rt);
              return (
                <button
                  key={rt}
                  type="button"
                  disabled={!editMode}
                  onClick={() => toggleRoomType(rt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:cursor-not-allowed ${
                    selected
                      ? "bg-gold text-navy-dark"
                      : "bg-navy-light text-white border border-gold/20 hover:border-gold/40"
                  }`}
                >
                  {rt}
                </button>
              );
            })}
          </div>
          {attributes.roomTypes.length === 0 && (
            <p className="text-red-400 text-xs">
              At least 1 room type required
            </p>
          )}
        </div>

        {/* Board Types */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">
            Board Types
            <RequiredMark />
          </Label>
          <div className="flex flex-wrap gap-2">
            {ALL_BOARD_TYPES.map((bt) => {
              const selected = attributes.boardTypes.includes(bt);
              return (
                <button
                  key={bt}
                  type="button"
                  disabled={!editMode}
                  onClick={() => toggleBoardType(bt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:cursor-not-allowed ${
                    selected
                      ? "bg-gold text-navy-dark"
                      : "bg-navy-light text-white border border-gold/20 hover:border-gold/40"
                  }`}
                >
                  {bt}
                </button>
              );
            })}
          </div>
          {attributes.boardTypes.length === 0 && (
            <p className="text-red-400 text-xs">
              At least 1 board type required
            </p>
          )}
        </div>
      </div>
    );
  };

  // ---- Section: Amenities ----
  const renderAmenities = () => {
    const count = attributes.amenities.length;
    const meetsMin = count >= 5;

    const toggleAmenity = (amenityId: string) => {
      if (!editMode) return;
      const current = attributes.amenities;
      const updated = current.includes(amenityId)
        ? current.filter((a) => a !== amenityId)
        : [...current, amenityId];
      update("amenities", updated);
    };

    return (
      <div className="space-y-4 p-5">
        {/* Counter + search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-xs ${
                meetsMin
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {count}/5 {meetsMin ? "\u2713" : ""}
            </Badge>
            <span className="text-xs text-gray-400">Min 5 required</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <Input
            value={amenitySearch}
            onChange={(e) => setAmenitySearch(e.target.value)}
            placeholder="Search amenities..."
            className="pl-9 bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50 h-8 text-xs"
          />
        </div>

        {/* Grouped amenities */}
        <div className="space-y-4">
          {Object.entries(groupedAmenities).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                {group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((amenity) => {
                  const selected = attributes.amenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      disabled={!editMode}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all border disabled:cursor-not-allowed ${
                        selected
                          ? "bg-gold/20 border-gold text-gold"
                          : "bg-navy-light/50 text-gray-400 border-transparent hover:border-gold/20"
                      }`}
                    >
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ---- Section: Pricing ----
  const renderPricing = () => (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-2 gap-4">
        {/* Net Rate From */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-xs">
            Net Rate From
            <RequiredMark />
          </Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={attributes.netRateFrom || ""}
            onChange={(e) =>
              update("netRateFrom", parseFloat(e.target.value) || 0)
            }
            disabled={!editMode}
            placeholder="0.00"
            className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50"
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
            onValueChange={(v) => update("currencyCode", v)}
            disabled={!editMode}
          >
            <SelectTrigger className="bg-navy-dark border-gold/20 text-white">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-navy border-gold/20">
              {CURRENCY_CODES.map((cc) => (
                <SelectItem
                  key={cc}
                  value={cc}
                  className="text-white hover:bg-navy-light focus:bg-navy-light focus:text-gold"
                >
                  {cc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Booking Sources */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">Booking Sources</Label>
        <div className="flex flex-wrap gap-2">
          {attributes.bookingSources.length === 0 ? (
            <span className="text-xs text-gray-500">No sources mapped</span>
          ) : (
            attributes.bookingSources.map((source) => (
              <Badge
                key={source}
                className="bg-navy-light text-gray-300 border-gold/20 text-xs"
              >
                {source}
              </Badge>
            ))
          )}
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
        >
          Go to Source Mapper
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );

  // ---- Section: Media ----
  const renderMedia = () => {
    const count = attributes.images.length;
    const meetsMin = count >= 5;

    const addImage = () => {
      const newEntry: ImageEntry = {
        id: `img-${Date.now()}`,
        url: "",
      };
      update("images", [...attributes.images, newEntry]);
    };

    const removeImage = (id: string) => {
      update(
        "images",
        attributes.images.filter((img) => img.id !== id)
      );
    };

    const updateImageUrl = (id: string, url: string) => {
      update(
        "images",
        attributes.images.map((img) =>
          img.id === id ? { ...img, url } : img
        )
      );
    };

    return (
      <div className="space-y-4 p-5">
        {/* Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-xs ${
                meetsMin
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {count}/5 {meetsMin ? "\u2713" : ""}
            </Badge>
            <span className="text-xs text-gray-400">Min 5 images required</span>
          </div>
          {editMode && (
            <Button
              type="button"
              size="sm"
              className="btn-gold text-xs h-7 px-3"
              onClick={addImage}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Image
            </Button>
          )}
        </div>

        {/* Image rows */}
        <div className="space-y-2">
          {attributes.images.map((img) => (
            <div key={img.id} className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-navy-dark border border-gold/10 flex-shrink-0 flex items-center justify-center">
                {img.url ? (
                  <img
                    src={img.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                )}
              </div>
              {/* URL Input */}
              <Input
                value={img.url}
                onChange={(e) => updateImageUrl(img.id, e.target.value)}
                disabled={!editMode}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50 text-xs h-8"
              />
              {/* Remove */}
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {attributes.images.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No images added yet
            </p>
          )}
        </div>
      </div>
    );
  };

  // ---- Section: SEO Content ----
  const renderSeoContent = () => (
    <div className="space-y-4 p-5">
      {/* Short Description */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">Short Description</Label>
        <Textarea
          value={attributes.shortDescription}
          readOnly
          disabled
          rows={3}
          className="bg-navy-dark border-gold/20 text-gray-300 placeholder:text-gray-500 text-xs resize-none"
        />
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          Go to Content Review
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Meta Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 text-xs">
            Meta Title
            <RequiredMark />
          </Label>
          <span
            className={`text-[10px] font-mono ${
              (attributes.metaTitle?.length || 0) > 60
                ? "text-red-400"
                : "text-gray-500"
            }`}
          >
            {attributes.metaTitle?.length || 0}/60
          </span>
        </div>
        <Input
          value={attributes.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value.slice(0, 60))}
          disabled={!editMode}
          placeholder="SEO meta title"
          maxLength={60}
          className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50 text-xs"
        />
      </div>

      {/* Meta Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 text-xs">
            Meta Description
            <RequiredMark />
          </Label>
          <span
            className={`text-[10px] font-mono ${
              (attributes.metaDescription?.length || 0) > 160
                ? "text-red-400"
                : "text-gray-500"
            }`}
          >
            {attributes.metaDescription?.length || 0}/160
          </span>
        </div>
        <Input
          value={attributes.metaDescription}
          onChange={(e) =>
            update("metaDescription", e.target.value.slice(0, 160))
          }
          disabled={!editMode}
          placeholder="SEO meta description"
          maxLength={160}
          className="bg-navy-dark border-gold/20 text-white placeholder:text-gray-500 focus:border-gold/50 text-xs"
        />
      </div>

      {/* Content Status */}
      <div className="space-y-1.5">
        <Label className="text-gray-300 text-xs">Content Status</Label>
        <div>
          <Badge
            className={`${
              CONTENT_STATUS_COLORS[attributes.contentStatus] ||
              "bg-gray-500/20 text-gray-400 border-gray-500/30"
            } text-xs`}
          >
            {attributes.contentStatus}
          </Badge>
        </div>
      </div>
    </div>
  );

  // ---- Section: Tags ----
  const renderTags = () => {
    // Group tags by dimension
    const grouped: Record<string, typeof attributes.tags> = {};
    for (const tag of attributes.tags) {
      if (!grouped[tag.dimension]) {
        grouped[tag.dimension] = [];
      }
      grouped[tag.dimension].push(tag);
    }

    const dimensionLabels: Record<string, string> = {
      budget_tier: "Budget Tier",
      travel_theme: "Travel Theme",
      audience: "Audience",
      season: "Season",
      accessibility: "Accessibility",
    };

    return (
      <div className="space-y-4 p-5">
        {attributes.tags.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No tags assigned
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([dimension, tags]) => (
              <div key={dimension}>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  {dimensionLabels[dimension] || dimension}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <Badge
                      key={`${tag.dimension}-${tag.value}-${idx}`}
                      className={`text-xs border ${
                        TAG_DIMENSION_COLORS[tag.dimension] ||
                        "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {tag.value}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          Manage Tags
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  };

  // ---- Render map for sections ----
  const sectionRenderers: Record<SectionId, () => React.ReactNode> = {
    basic: renderBasicInfo,
    location: renderLocation,
    operations: renderOperations,
    roomBoard: renderRoomBoard,
    amenities: renderAmenities,
    pricing: renderPricing,
    media: renderMedia,
    seo: renderSeoContent,
    tags: renderTags,
  };

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <div
          key={section.id}
          className="rounded-lg border border-gold/10 bg-navy overflow-hidden"
        >
          {renderSectionHeader(section)}
          {openSections.has(section.id) && (
            <div className="border-t border-gold/10">
              {sectionRenderers[section.id]()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
