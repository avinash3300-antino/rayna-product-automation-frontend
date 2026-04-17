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
import { COUNTRY_OPTIONS, COUNTRY_CITIES } from "@/lib/mock-destinations-data";
import type {
  AddDestinationFormData,
  ProductCategory,
} from "@/types/destinations";

interface AddDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddDestinationFormData) => void;
}

const ALL_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "hotels", label: "Hotels" },
  { value: "attractions", label: "Attractions" },
  { value: "transfers", label: "Transfers" },
  { value: "restaurants", label: "Restaurants" },
];

const ALL_CATEGORY_VALUES: ProductCategory[] = ALL_CATEGORIES.map(
  (c) => c.value
);

const INITIAL_FORM: AddDestinationFormData = {
  name: "",
  country: "",
  region: "",
  city: "",
  timezone: "",
  latitude: "",
  longitude: "",
  enabledCategories: [...ALL_CATEGORY_VALUES],
};

// Note: name, region, timezone, latitude, longitude are kept in the type
// but not shown in the form — they can be set later or derived server-side.

export function AddDestinationDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddDestinationDialogProps) {
  const [form, setForm] = useState<AddDestinationFormData>(INITIAL_FORM);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  // When country changes, update city options and reset city
  useEffect(() => {
    if (form.country) {
      const cities = COUNTRY_CITIES[form.country] ?? [];
      setCityOptions(cities);
      // Auto-select the first city if available
      if (cities.length > 0) {
        setForm((prev) => ({ ...prev, city: cities[0] }));
      } else {
        setForm((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setCityOptions([]);
      setForm((prev) => ({ ...prev, city: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.country]);

  function handleChange(field: keyof AddDestinationFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryToggle(category: ProductCategory, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      enabledCategories: checked
        ? [...prev.enabledCategories, category]
        : prev.enabledCategories.filter((c) => c !== category),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm(INITIAL_FORM);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Destination</DialogTitle>
          <DialogDescription>
            Add a new destination market to the ingestion pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={form.country}
              onValueChange={(v) => handleChange("country", v)}
            >
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
              value={form.city}
              onValueChange={(v) => handleChange("city", v)}
              disabled={cityOptions.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    form.country ? "Select city" : "Select a country first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
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
                    id={`cat-${cat.value}`}
                    checked={form.enabledCategories.includes(cat.value)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(cat.value, !!checked)
                    }
                  />
                  <label
                    htmlFor={`cat-${cat.value}`}
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
            <Button type="submit">Add Destination</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
