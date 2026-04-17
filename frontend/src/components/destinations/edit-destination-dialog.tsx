"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { COUNTRY_OPTIONS, COUNTRY_CITIES } from "@/lib/mock-destinations-data";
import type { Destination, ProductCategory } from "@/types/destinations";

interface EditDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
  onSubmit: (
    destinationId: string,
    data: {
      name: string;
      country_name: string;
      country_flag: string;
      city_name: string;
      enabled_categories: string[];
    }
  ) => void;
  isPending?: boolean;
}

const ALL_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "hotels", label: "Hotels" },
  { value: "attractions", label: "Attractions" },
  { value: "transfers", label: "Transfers" },
  { value: "restaurants", label: "Restaurants" },
];

export function EditDestinationDialog({
  open,
  onOpenChange,
  destination,
  onSubmit,
  isPending,
}: EditDestinationDialogProps) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [enabledCategories, setEnabledCategories] = useState<ProductCategory[]>(
    []
  );
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  // Populate form when destination changes
  useEffect(() => {
    if (destination && open) {
      setCountry(destination.country);
      setCity(destination.city);
      // Derive enabled categories from productCounts keys (all by default)
      setEnabledCategories(["hotels", "attractions", "transfers", "restaurants"]);

      const cities = COUNTRY_CITIES[destination.country] ?? [];
      setCityOptions(cities);
    }
  }, [destination, open]);

  // Update city options when country changes (user-driven change)
  useEffect(() => {
    if (country) {
      const cities = COUNTRY_CITIES[country] ?? [];
      setCityOptions(cities);
    } else {
      setCityOptions([]);
    }
  }, [country]);

  function handleCountryChange(value: string) {
    setCountry(value);
    const cities = COUNTRY_CITIES[value] ?? [];
    setCity(cities[0] ?? "");
  }

  function handleCategoryToggle(category: ProductCategory, checked: boolean) {
    setEnabledCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination) return;

    const countryOption = COUNTRY_OPTIONS.find((opt) => opt.value === country);

    onSubmit(destination.id, {
      name: city || country,
      country_name: country,
      country_flag: countryOption?.flag ?? "",
      city_name: city,
      enabled_categories: enabledCategories,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
          <DialogDescription>
            Update destination details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.flag} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Select
              value={city}
              onValueChange={setCity}
              disabled={cityOptions.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    country ? "Select city" : "Select a country first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <Label>Product Categories</Label>
            <div className="grid grid-cols-2 gap-3">
              {ALL_CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-cat-${cat.value}`}
                    checked={enabledCategories.includes(cat.value)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(cat.value, !!checked)
                    }
                  />
                  <label
                    htmlFor={`edit-cat-${cat.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
