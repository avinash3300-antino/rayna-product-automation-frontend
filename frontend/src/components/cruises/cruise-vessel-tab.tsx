"use client";

import {
  Ship,
  Ruler,
  Calendar,
  Users,
  Layers,
  Sparkles,
  BedDouble,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Cruise } from "@/types/cruises";

interface CruiseVesselTabProps {
  cruise: Cruise;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export function CruiseVesselTab({ cruise }: CruiseVesselTabProps) {
  return (
    <div className="space-y-6">
      {/* Vessel Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ship className="h-4 w-4" />
            Vessel Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Vessel Name"
            value={cruise.vesselName || <EmptyField />}
          />
          <FieldRow
            label="Vessel Type"
            value={
              cruise.vesselType ? (
                <span className="capitalize">{cruise.vesselType}</span>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Length"
            value={
              cruise.vesselLengthM !== null ? (
                <span className="flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" />
                  {cruise.vesselLengthM}m
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Year Built"
            value={
              cruise.vesselYearBuilt !== null ? (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {cruise.vesselYearBuilt}
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Capacity"
            value={
              cruise.vesselCapacity !== null ? (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {cruise.vesselCapacity} guests
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Deck Count"
            value={
              cruise.deckCount !== null ? (
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {cruise.deckCount} decks
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
        </CardContent>
      </Card>

      {/* Onboard Facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Onboard Facilities ({cruise.onboardFacilities?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.onboardFacilities && cruise.onboardFacilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cruise.onboardFacilities.map((facility, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {facility}
                </Badge>
              ))}
            </div>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Cabins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BedDouble className="h-4 w-4" />
            Cabins ({cruise.cabins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.cabins.length > 0 ? (
            <div className="space-y-4">
              {cruise.cabins.map((cabin) => (
                <div
                  key={cabin.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold capitalize">
                      {cabin.cabinType}
                    </h4>
                    <div className="flex items-center gap-2">
                      {cabin.cabinCount !== null && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          {cabin.cabinCount} cabins
                        </Badge>
                      )}
                      {cabin.maxOccupancy !== null && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          <Users className="h-3 w-3 mr-1" />
                          Max {cabin.maxOccupancy}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {cabin.description && (
                    <p className="text-sm text-muted-foreground">
                      {cabin.description}
                    </p>
                  )}

                  {cabin.amenities && cabin.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cabin.amenities.map((amenity, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px] h-5 font-normal"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BedDouble className="h-10 w-10 mb-2" />
              <p className="text-sm">No cabin information available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
