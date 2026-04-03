"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationCard } from "./destination-card";
import { AddDestinationDialog } from "./add-destination-dialog";
import { IntelligenceSummarySheet } from "./intelligence-summary-sheet";
import { MOCK_INTELLIGENCE_SUMMARIES, COUNTRY_OPTIONS } from "@/lib/mock-destinations-data";
import { useDestinations, useCreateDestination } from "@/hooks/api/use-destinations";
import type { AddDestinationFormData } from "@/types/destinations";
import { toast } from "sonner";

export function DestinationsGrid() {
  const { data, isLoading, error } = useDestinations({ perPage: 100 });
  const createDestination = useCreateDestination();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [intelligenceSheetOpen, setIntelligenceSheetOpen] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);

  const destinations = data?.data ?? [];

  function handleAddDestination(formData: AddDestinationFormData) {
    const countryOption = COUNTRY_OPTIONS.find(
      (opt) => opt.value === formData.country
    );

    createDestination.mutate(
      {
        name: formData.city || formData.country,
        country_name: formData.country,
        country_flag: countryOption?.flag ?? "",
        city_name: formData.city,
        enabled_categories: formData.enabledCategories,
      },
      {
        onSuccess: () => {
          toast.success(`${formData.city} has been added successfully.`);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to add destination"
          );
        },
      }
    );
  }

  function handleRunIngestion(id: string) {
    // TODO: Integrate with ingestion API
    console.log("Run ingestion:", id);
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
        <Button
          onClick={() => setAddDialogOpen(true)}
          disabled={createDestination.isPending}
        >
          {createDestination.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add Destination
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-destructive">
            Failed to load destinations. Please try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && destinations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No destinations found. Add your first destination to get started.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && destinations.length > 0 && (
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
      )}

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
