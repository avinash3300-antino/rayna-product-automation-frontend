"use client";

import { Hotel, MapPin, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/products";
import type { PackageComponent, ComponentRules } from "@/types/packages";
import { HotelSelector } from "../selectors/hotel-selector";
import { AttractionSelector } from "../selectors/attraction-selector";
import { TransferSelector } from "../selectors/transfer-selector";

interface StepComponentsProps {
  destination: string;
  selectedComponents: PackageComponent[];
  componentRules: ComponentRules;
  availableProducts: Product[];
  onComponentsChange: (components: PackageComponent[]) => void;
}

export function StepComponents({
  destination,
  selectedComponents,
  componentRules,
  availableProducts,
  onComponentsChange,
}: StepComponentsProps) {
  const hotels = availableProducts.filter((p) => p.category === "hotels");
  const attractions = availableProducts.filter((p) => p.category === "attractions");
  const transfers = availableProducts.filter((p) => p.category === "transfers");

  const selectedHotelIds = selectedComponents
    .filter((c) => c.category === "hotels")
    .map((c) => c.productId);
  const selectedAttractionIds = selectedComponents
    .filter((c) => c.category === "attractions")
    .map((c) => c.productId);
  const selectedTransferIds = selectedComponents
    .filter((c) => c.category === "transfers")
    .map((c) => c.productId);

  const toggleProduct = (product: Product) => {
    const exists = selectedComponents.find((c) => c.productId === product.id);
    if (exists) {
      onComponentsChange(
        selectedComponents.filter((c) => c.productId !== product.id)
      );
    } else {
      const newComp: PackageComponent = {
        productId: product.id,
        product,
        category: product.category,
        quantity: 1,
        netRate: product.attributes.pricing?.amount ?? 0,
        currency: product.attributes.pricing?.currency ?? "AED",
      };
      onComponentsChange([...selectedComponents, newComp]);
    }
  };

  const rules = componentRules;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select products from <span className="font-medium text-foreground">{destination}</span> to include in your package.
      </p>

      {/* Hotels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Hotel className="h-4 w-4" />
            Hotels
            <span className="text-xs text-muted-foreground font-normal">
              ({rules.hotels.min === rules.hotels.max
                ? `${rules.hotels.min} required`
                : `${rules.hotels.min}–${rules.hotels.max} required`})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HotelSelector
            hotels={hotels}
            selectedIds={selectedHotelIds}
            onToggle={toggleProduct}
            maxCount={rules.hotels.max}
          />
        </CardContent>
      </Card>

      {/* Attractions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Attractions
            <span className="text-xs text-muted-foreground font-normal">
              ({rules.attractions.min}–{rules.attractions.max} required)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttractionSelector
            attractions={attractions}
            selectedIds={selectedAttractionIds}
            onToggle={toggleProduct}
            minCount={rules.attractions.min}
            maxCount={rules.attractions.max}
          />
        </CardContent>
      </Card>

      {/* Transfers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Car className="h-4 w-4" />
            Transfers
            <span className="text-xs text-muted-foreground font-normal">
              ({rules.transfers.min === rules.transfers.max
                ? `${rules.transfers.min} required`
                : `${rules.transfers.min}–${rules.transfers.max} required`})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransferSelector
            transfers={transfers}
            selectedIds={selectedTransferIds}
            onToggle={toggleProduct}
            minCount={rules.transfers.min}
            maxCount={rules.transfers.max}
          />
        </CardContent>
      </Card>
    </div>
  );
}
