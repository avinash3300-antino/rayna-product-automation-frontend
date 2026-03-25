"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COUNTRY_OPTIONS } from "@/lib/mock-destinations-data";
import type { AddDestinationFormData } from "@/types/destinations";

interface AddDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddDestinationFormData) => void;
}

const INITIAL_FORM: AddDestinationFormData = {
  name: "",
  country: "",
  region: "",
  city: "",
  timezone: "",
  latitude: "",
  longitude: "",
};

export function AddDestinationDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddDestinationDialogProps) {
  const [form, setForm] = useState<AddDestinationFormData>(INITIAL_FORM);

  function handleChange(field: keyof AddDestinationFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            <Label htmlFor="dest-name">Destination Name</Label>
            <Input
              id="dest-name"
              placeholder="e.g. Dubai"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dest-region">Region</Label>
              <Input
                id="dest-region"
                placeholder="e.g. Middle East"
                value={form.region}
                onChange={(e) => handleChange("region", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-city">City</Label>
              <Input
                id="dest-city"
                placeholder="e.g. Dubai"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dest-tz">Timezone</Label>
            <Input
              id="dest-tz"
              placeholder="e.g. Asia/Dubai"
              value={form.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dest-lat">
                Latitude{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="dest-lat"
                type="number"
                step="any"
                placeholder="25.2048"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-lng">
                Longitude{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="dest-lng"
                type="number"
                step="any"
                placeholder="55.2708"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
              />
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
