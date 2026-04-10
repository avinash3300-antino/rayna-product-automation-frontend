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
  onSubmit: (cityId: string, category: string) => void;
  isPending: boolean;
}

const CATEGORIES = [
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "luxury", label: "Luxury" },
  { value: "nature", label: "Nature" },
  { value: "food_drink", label: "Food & Drink" },
  { value: "nightlife", label: "Nightlife" },
] as const;

export function RunDiscoveryForm({ onSubmit, isPending }: RunDiscoveryFormProps) {
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: destinationsData, isLoading: isLoadingDestinations } =
    useDestinations({ perPage: 100 });

  const destinations = destinationsData?.data ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCityId || !selectedCategory) return;
    onSubmit(selectedCityId, selectedCategory);
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
                  {CATEGORIES.map((cat) => (
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
