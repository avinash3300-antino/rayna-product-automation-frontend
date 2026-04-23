"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDestinations } from "@/hooks/api/use-destinations";

interface RunDiscoveryFormProps {
  onSubmit: (cityId: string, category: string, productType: string) => void;
  isPending: boolean;
}

const ACTIVITY_CATEGORIES = [
  { value: "Sightseeing Tours", label: "Sightseeing Tours" },
  { value: "Landmark Tickets", label: "Landmark Tickets" },
  { value: "Museum & Gallery", label: "Museum & Gallery" },
  { value: "Thames River", label: "Thames River" },
  { value: "Day Trips", label: "Day Trips" },
  { value: "Harry Potter & Film", label: "Harry Potter & Film" },
  { value: "Food & Drink", label: "Food & Drink" },
  { value: "Shows & Entertainment", label: "Shows & Entertainment" },
  { value: "Passes & Combos", label: "Passes & Combos" },
  { value: "Transfers", label: "Transfers" },
  { value: "Sports & Outdoor", label: "Sports & Outdoor" },
  { value: "Night Tours", label: "Night Tours" },
  { value: "Family & Kids", label: "Family & Kids" },
  { value: "Luxury & Private", label: "Luxury & Private" },
  { value: "Seasonal & Events", label: "Seasonal & Events" },
] as const;

const CRUISE_CATEGORIES = [
  { value: "Dinner Cruise", label: "Dinner Cruise" },
  { value: "Sightseeing Cruise", label: "Sightseeing Cruise" },
  { value: "Overnight Cruise", label: "Overnight Cruise" },
  { value: "Multi-Day Cruise", label: "Multi-Day Cruise" },
  { value: "River Cruise", label: "River Cruise" },
  { value: "Luxury Cruise", label: "Luxury Cruise" },
] as const;

const PRODUCT_TYPES = [
  { value: "activities", label: "Activities" },
  { value: "cruises", label: "Cruises" },
] as const;

export function RunDiscoveryForm({ onSubmit, isPending }: RunDiscoveryFormProps) {
  const [selectedProductType, setSelectedProductType] = useState("activities");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories =
    selectedProductType === "cruises" ? CRUISE_CATEGORIES : ACTIVITY_CATEGORIES;

  const { data: destinationsData, isLoading: isLoadingDestinations } =
    useDestinations({ perPage: 100 });

  const destinations = destinationsData?.data ?? [];

  function handleProductTypeChange(value: string) {
    setSelectedProductType(value);
    setSelectedCategory("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCityId || !selectedCategory) return;
    onSubmit(selectedCityId, selectedCategory, selectedProductType);
  }

  const isFormValid = selectedCityId && selectedCategory;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-[#C9A84C]" />
          Run Discovery
        </CardTitle>
        <CardDescription>
          Select a destination and category to discover relevant sources using
          Ahrefs, SearchAPI, and Claude AI synthesis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product-type-select">Product Type</Label>
            <Select
              value={selectedProductType}
              onValueChange={handleProductTypeChange}
            >
              <SelectTrigger id="product-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((pt) => (
                  <SelectItem key={pt.value} value={pt.value}>
                    {pt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city-select">Destination</Label>
              <Select
                value={selectedCityId}
                onValueChange={setSelectedCityId}
                disabled={isLoadingDestinations}
              >
                <SelectTrigger id="city-select">
                  <SelectValue
                    placeholder={
                      isLoadingDestinations
                        ? "Loading destinations..."
                        : "Select destination"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id}>
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Discovery...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Run Discovery
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
