"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/products";

interface ProductAttributesTabProps {
  product: Product;
  editing: boolean;
}

export function ProductAttributesTab({ product, editing }: ProductAttributesTabProps) {
  const { attributes } = product;

  return (
    <div className="space-y-6">
      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address" value={attributes.location.address} editing={editing} />
            <Field label="City" value={attributes.location.city} editing={editing} />
            <Field label="Country" value={attributes.location.country} editing={editing} />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Latitude"
                value={String(attributes.location.latitude)}
                editing={editing}
                type="number"
              />
              <Field
                label="Longitude"
                value={String(attributes.location.longitude)}
                editing={editing}
                type="number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          {attributes.pricing ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Currency" value={attributes.pricing.currency} editing={editing} />
              <Field
                label="Amount"
                value={String(attributes.pricing.amount)}
                editing={editing}
                type="number"
              />
              <Field label="Per" value={attributes.pricing.per} editing={editing} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No pricing data</p>
          )}
        </CardContent>
      </Card>

      {/* Other Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Star Rating"
              value={attributes.starRating ? String(attributes.starRating) : "N/A"}
              editing={editing}
              type="number"
            />
            <Field
              label="Duration"
              value={attributes.duration ?? "N/A"}
              editing={editing}
            />
            <Field
              label="Operating Hours"
              value={attributes.operatingHours ?? "N/A"}
              editing={editing}
            />
            <Field
              label="Website"
              value={attributes.website ?? "N/A"}
              editing={editing}
            />
            <Field
              label="Contact Phone"
              value={attributes.contactPhone ?? "N/A"}
              editing={editing}
            />
            <Field
              label="Contact Email"
              value={attributes.contactEmail ?? "N/A"}
              editing={editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {editing ? (
        <Input type={type} defaultValue={value === "N/A" ? "" : value} />
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  );
}
