"use client";

import { useState, useMemo, useCallback } from "react";
import { Filter, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  ProductSourceMapping,
  BookingSource,
  MappingStatus,
} from "@/types/booking-sources";
import {
  MAPPING_STATUS_CONFIG,
  CATEGORY_ICON_MAP,
} from "@/types/booking-sources";
import {
  MOCK_PRODUCT_MAPPINGS,
  MOCK_BOOKING_SOURCES,
  MOCK_DESTINATIONS,
} from "@/lib/mock-booking-sources";

function SourceDropdown({
  value,
  sources,
  onChange,
}: {
  value: string | null;
  sources: BookingSource[];
  onChange: (id: string | null) => void;
}) {
  return (
    <Select
      value={value || "none"}
      onValueChange={(v) => onChange(v === "none" ? null : v)}
    >
      <SelectTrigger className="h-8 text-xs w-[150px]">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">None</span>
        </SelectItem>
        {sources.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function computeMappingStatus(
  s1: string | null,
  s2: string | null,
  s3: string | null
): MappingStatus {
  if (s1 && s2 && s3) return "complete";
  if (s1 || s2 || s3) return "partial";
  return "unmapped";
}

export function ProductMappings() {
  const [mappings, setMappings] =
    useState<ProductSourceMapping[]>(MOCK_PRODUCT_MAPPINGS);
  const [sources] = useState<BookingSource[]>(MOCK_BOOKING_SOURCES);
  const [destFilter, setDestFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [unmappedOnly, setUnmappedOnly] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkSource1, setBulkSource1] = useState<string | null>(null);
  const [bulkSource2, setBulkSource2] = useState<string | null>(null);
  const [bulkSource3, setBulkSource3] = useState<string | null>(null);
  const [bulkStep, setBulkStep] = useState(1);

  const activeSources = useMemo(
    () => sources.filter((s) => s.isActive),
    [sources]
  );

  const filteredMappings = useMemo(() => {
    return mappings.filter((m) => {
      if (destFilter !== "all" && m.destination !== destFilter) return false;
      if (categoryFilter !== "all" && m.productCategory !== categoryFilter)
        return false;
      if (unmappedOnly && m.mappingStatus !== "unmapped") return false;
      if (sourceFilter !== "all") {
        const hasSource =
          m.source1Id === sourceFilter ||
          m.source2Id === sourceFilter ||
          m.source3Id === sourceFilter;
        if (!hasSource) return false;
      }
      return true;
    });
  }, [mappings, destFilter, categoryFilter, unmappedOnly, sourceFilter]);

  const getSourceName = useCallback(
    (id: string | null) => {
      if (!id) return "—";
      return sources.find((s) => s.id === id)?.name || "Unknown";
    },
    [sources]
  );

  const handleSourceChange = useCallback(
    (mappingId: string, slot: "source1Id" | "source2Id" | "source3Id", value: string | null) => {
      setMappings((prev) =>
        prev.map((m) => {
          if (m.id !== mappingId) return m;
          const updated = { ...m, [slot]: value, lastUpdated: new Date().toISOString() };
          updated.mappingStatus = computeMappingStatus(
            updated.source1Id,
            updated.source2Id,
            updated.source3Id
          );
          return updated;
        })
      );
    },
    []
  );

  const handleBulkApply = useCallback(() => {
    setMappings((prev) =>
      prev.map((m) => {
        if (!bulkSelected.has(m.id)) return m;
        const updated = {
          ...m,
          source1Id: bulkSource1 ?? m.source1Id,
          source2Id: bulkSource2 ?? m.source2Id,
          source3Id: bulkSource3 ?? m.source3Id,
          lastUpdated: new Date().toISOString(),
        };
        updated.mappingStatus = computeMappingStatus(
          updated.source1Id,
          updated.source2Id,
          updated.source3Id
        );
        return updated;
      })
    );
    setBulkOpen(false);
    setBulkSelected(new Set());
    setBulkStep(1);
    setBulkSource1(null);
    setBulkSource2(null);
    setBulkSource3(null);
  }, [bulkSelected, bulkSource1, bulkSource2, bulkSource3]);

  const statusCounts = useMemo(() => {
    const counts = { complete: 0, partial: 0, unmapped: 0 };
    mappings.forEach((m) => counts[m.mappingStatus]++);
    return counts;
  }, [mappings]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          {mappings.length} products
        </span>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          {statusCounts.complete} Complete
        </Badge>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          {statusCounts.partial} Partial
        </Badge>
        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          {statusCounts.unmapped} Unmapped
        </Badge>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={destFilter} onValueChange={setDestFilter}>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {MOCK_DESTINATIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hotels">Hotels</SelectItem>
              <SelectItem value="attractions">Attractions</SelectItem>
              <SelectItem value="transfers">Transfers</SelectItem>
              <SelectItem value="restaurants">Restaurants</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {activeSources.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={unmappedOnly}
              onCheckedChange={setUnmappedOnly}
              id="unmapped-toggle"
            />
            <Label htmlFor="unmapped-toggle" className="text-xs cursor-pointer">
              Unmapped Only
            </Label>
          </div>
          <div className="flex-1" />
          <Button size="sm" variant="outline" onClick={() => { setBulkOpen(true); setBulkStep(1); }}>
            Bulk Assign
          </Button>
        </div>
      </Card>

      {/* Mapping Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Source 1 (Primary)</TableHead>
              <TableHead>Source 2 (Fallback)</TableHead>
              <TableHead>Source 3 (Manual)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMappings.map((mapping) => {
              const statusConfig = MAPPING_STATUS_CONFIG[mapping.mappingStatus];
              return (
                <TableRow
                  key={mapping.id}
                  className={
                    mapping.mappingStatus === "unmapped"
                      ? "bg-red-500/5"
                      : undefined
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{CATEGORY_ICON_MAP[mapping.productCategory]}</span>
                      <span className="font-medium text-sm">
                        {mapping.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {mapping.destination}
                  </TableCell>
                  <TableCell>
                    <SourceDropdown
                      value={mapping.source1Id}
                      sources={activeSources}
                      onChange={(v) =>
                        handleSourceChange(mapping.id, "source1Id", v)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <SourceDropdown
                      value={mapping.source2Id}
                      sources={activeSources}
                      onChange={(v) =>
                        handleSourceChange(mapping.id, "source2Id", v)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <SourceDropdown
                      value={mapping.source3Id}
                      sources={activeSources}
                      onChange={(v) =>
                        handleSourceChange(mapping.id, "source3Id", v)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(mapping.lastUpdated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMappings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Bulk Assign Drawer */}
      <Sheet open={bulkOpen} onOpenChange={setBulkOpen}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bulk Assign Sources</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 pt-6">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center gap-1 ${
                    step <= bulkStep
                      ? "text-foreground"
                      : "text-muted-foreground/40"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border ${
                      step < bulkStep
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : step === bulkStep
                        ? "border-foreground"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {step < bulkStep ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 5 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Filter */}
            {bulkStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Step 1: Filter Products
                </h3>
                <Select value={destFilter} onValueChange={setDestFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {MOCK_DESTINATIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="transfers">Transfers</SelectItem>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {filteredMappings.length} products match
                </p>
                <Button onClick={() => setBulkStep(2)} className="w-full">
                  Next
                </Button>
              </div>
            )}

            {/* Step 2: Select Products */}
            {bulkStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Step 2: Select Products ({bulkSelected.size} selected)
                </h3>
                <div className="border rounded-md max-h-[300px] overflow-y-auto">
                  {filteredMappings.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    >
                      <Checkbox
                        checked={bulkSelected.has(m.id)}
                        onCheckedChange={(checked) => {
                          setBulkSelected((prev) => {
                            const next = new Set(prev);
                            if (checked) next.add(m.id);
                            else next.delete(m.id);
                            return next;
                          });
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium">
                          {CATEGORY_ICON_MAP[m.productCategory]} {m.productName}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {m.destination}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBulkStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setBulkStep(3)}
                    className="flex-1"
                    disabled={bulkSelected.size === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Sources */}
            {bulkStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Step 3: Choose Sources
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Source 1 (Primary)</Label>
                    <Select
                      value={bulkSource1 || "none"}
                      onValueChange={(v) =>
                        setBulkSource1(v === "none" ? null : v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Keep existing</SelectItem>
                        {activeSources.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Source 2 (Fallback)</Label>
                    <Select
                      value={bulkSource2 || "none"}
                      onValueChange={(v) =>
                        setBulkSource2(v === "none" ? null : v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Keep existing</SelectItem>
                        {activeSources.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Source 3 (Manual)</Label>
                    <Select
                      value={bulkSource3 || "none"}
                      onValueChange={(v) =>
                        setBulkSource3(v === "none" ? null : v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Keep existing</SelectItem>
                        {activeSources.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBulkStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={() => setBulkStep(4)} className="flex-1">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {bulkStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Step 4: Preview Assignments
                </h3>
                <div className="border rounded-md p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-medium">{bulkSelected.size}</span>{" "}
                    products selected
                  </p>
                  {bulkSource1 && (
                    <p>
                      Source 1 → {getSourceName(bulkSource1)}
                    </p>
                  )}
                  {bulkSource2 && (
                    <p>
                      Source 2 → {getSourceName(bulkSource2)}
                    </p>
                  )}
                  {bulkSource3 && (
                    <p>
                      Source 3 → {getSourceName(bulkSource3)}
                    </p>
                  )}
                  {!bulkSource1 && !bulkSource2 && !bulkSource3 && (
                    <p className="text-muted-foreground">
                      No source changes selected
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBulkStep(3)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={() => setBulkStep(5)} className="flex-1">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Apply */}
            {bulkStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Step 5: Apply</h3>
                <p className="text-sm text-muted-foreground">
                  This will update source assignments for{" "}
                  <span className="font-medium text-foreground">
                    {bulkSelected.size}
                  </span>{" "}
                  products. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBulkStep(4)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={handleBulkApply} className="flex-1">
                    Apply to {bulkSelected.size} Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
