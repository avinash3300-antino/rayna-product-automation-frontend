"use client";

import {
  MapPin,
  Globe,
  Navigation,
  Bus,
  Hotel,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/types/activities";

interface ActivityLocationTabProps {
  activity: Activity;
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

export function ActivityLocationTab({ activity }: ActivityLocationTabProps) {
  return (
    <div className="space-y-6">
      {/* Primary Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Primary Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow label="Country" value={activity.country} />
          <FieldRow label="City" value={activity.city} />
          <FieldRow label="Area" value={activity.area || <EmptyField />} />
          <FieldRow label="Address" value={activity.address} />
          <FieldRow
            label="Coordinates"
            value={`${activity.lat}, ${activity.lng}`}
          />
          <FieldRow
            label="Maps Link"
            value={
              activity.mapsLink ? (
                <a
                  href={activity.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 underline underline-offset-2"
                >
                  Open in Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <EmptyField />
              )
            }
          />
        </CardContent>
      </Card>

      {/* Meeting Point */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Meeting Point
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Name"
            value={activity.meetingPointName || <EmptyField />}
          />
          <FieldRow
            label="Description"
            value={
              activity.meetingPointDesc ? (
                <span className="max-w-sm">{activity.meetingPointDesc}</span>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="Nearby Landmark"
            value={activity.nearbyLandmark || <EmptyField />}
          />
        </CardContent>
      </Card>

      {/* Pickup & Dropoff */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bus className="h-4 w-4" />
            Pickup & Dropoff
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Pickup Available"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.pickupAvailable
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {activity.pickupAvailable ? "Yes" : "No"}
              </Badge>
            }
          />
          {activity.pickupLocations && activity.pickupLocations.length > 0 && (
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-2">
                Pickup Locations
              </p>
              <div className="flex flex-wrap gap-2">
                {activity.pickupLocations.map((loc, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <FieldRow
            label="Hotel Pickup Included"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.hotelPickupIncluded
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {activity.hotelPickupIncluded ? "Yes" : "No"}
              </Badge>
            }
          />
          <FieldRow
            label="Dropoff Available"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.dropoffAvailable
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {activity.dropoffAvailable ? "Yes" : "No"}
              </Badge>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
