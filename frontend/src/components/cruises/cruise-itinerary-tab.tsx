"use client";

import {
  MapPin,
  Anchor,
  Route,
  CircleDot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Cruise } from "@/types/cruises";

interface CruiseItineraryTabProps {
  cruise: Cruise;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

export function CruiseItineraryTab({ cruise }: CruiseItineraryTabProps) {
  const sortedItinerary = [...cruise.itinerary].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="space-y-6">
      {/* Route Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.routeDescription ? (
            <p className="text-sm whitespace-pre-wrap">
              {cruise.routeDescription}
            </p>
          ) : (
            <EmptyField />
          )}
        </CardContent>
      </Card>

      {/* Itinerary Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Anchor className="h-4 w-4" />
            Itinerary ({sortedItinerary.length} stops)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedItinerary.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-border" />

              <div className="space-y-6">
                {sortedItinerary.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === sortedItinerary.length - 1;

                  return (
                    <div key={stop.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex items-center justify-center shrink-0">
                        <div
                          className={`h-[30px] w-[30px] rounded-full border-2 flex items-center justify-center ${
                            isFirst || isLast
                              ? "border-[#C9A84C] bg-[#C9A84C]/10"
                              : "border-border bg-background"
                          }`}
                        >
                          {isFirst || isLast ? (
                            <MapPin className="h-3.5 w-3.5 text-[#C9A84C]" />
                          ) : (
                            <CircleDot className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold">
                            {stop.portOrStop}
                          </h4>
                          {stop.dayNumber !== null && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5"
                            >
                              Day {stop.dayNumber}
                            </Badge>
                          )}
                          {stop.timeLabel && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5"
                            >
                              {stop.timeLabel}
                            </Badge>
                          )}
                          {stop.shoreExcursionAvailable && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20"
                            >
                              Shore Excursion Available
                            </Badge>
                          )}
                        </div>
                        {stop.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {stop.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Anchor className="h-10 w-10 mb-2" />
              <p className="text-sm">No itinerary stops defined</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
