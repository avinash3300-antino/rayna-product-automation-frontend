"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "./destination-card";
import { AddDestinationDialog } from "./add-destination-dialog";
import { IntelligenceSummarySheet } from "./intelligence-summary-sheet";
import {
  MOCK_DESTINATIONS,
  MOCK_INTELLIGENCE_SUMMARIES,
  COUNTRY_OPTIONS,
} from "@/lib/mock-destinations-data";
import type { Destination, AddDestinationFormData } from "@/types/destinations";

export function DestinationsGrid() {
  const [destinations, setDestinations] =
    useState<Destination[]>(MOCK_DESTINATIONS);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [intelligenceSheetOpen, setIntelligenceSheetOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);

  function handleAddDestination(data: AddDestinationFormData) {
    const countryOption = COUNTRY_OPTIONS.find(
      (opt) => opt.value === data.country
    );
    const newDest: Destination = {
      id: `dest-${Date.now()}`,
      name: data.name,
      country: data.country,
      countryFlag: countryOption?.flag ?? "",
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      status: "active",
      productCounts: { hotels: 0, attractions: 0, transfers: 0, restaurants: 0 },
      lastIngestionRun: null,
      intelligenceFilter: {
        lastRunDate: null,
        keywordsFound: 0,
        sourcesApproved: 0,
      },
    };
    setDestinations((prev) => [...prev, newDest]);
  }

  function handleRunIngestion(id: string) {
    setDestinations((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              lastIngestionRun: {
                date: new Date().toISOString(),
                status: "running" as const,
                recordsProcessed: 0,
                durationMs: 0,
              },
            }
          : d
      )
    );
  }

  function handleViewIntelligence(id: string) {
    setSelectedDestinationId(id);
    setIntelligenceSheetOpen(true);
  }

  function handleEdit(id: string) {
    // Placeholder for edit functionality
    console.log("Edit destination:", id);
  }

  const selectedDestination =
    destinations.find((d) => d.id === selectedDestinationId) ?? null;
  const selectedSummary = selectedDestinationId
    ? (MOCK_INTELLIGENCE_SUMMARIES[selectedDestinationId] ?? null)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Destinations</h2>
          <p className="text-muted-foreground">
            Manage destination markets and intelligence pipelines
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            onRunIngestion={handleRunIngestion}
            onViewIntelligence={handleViewIntelligence}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Add Destination Dialog */}
      <AddDestinationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddDestination}
      />

      {/* Intelligence Summary Sheet */}
      <IntelligenceSummarySheet
        open={intelligenceSheetOpen}
        onOpenChange={setIntelligenceSheetOpen}
        destination={selectedDestination}
        summary={selectedSummary}
      />
    </div>
  );
}
