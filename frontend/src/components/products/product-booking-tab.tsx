"use client";

import { ExternalLink, Link2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/products";

interface ProductBookingTabProps {
  product: Product;
  editing: boolean;
}

export function ProductBookingTab({ product, editing }: ProductBookingTabProps) {
  const { bookingSource } = product;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Booking Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingSource ? (
          <div className="space-y-4">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Source ID</Label>
                  <Input defaultValue={bookingSource.id} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Source Name</Label>
                  <Input defaultValue={bookingSource.name} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Source URL</Label>
                  <Input defaultValue={bookingSource.url} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{bookingSource.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="text-sm font-mono">{bookingSource.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">URL</p>
                  <a
                    href={bookingSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {bookingSource.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Link2 className="h-10 w-10 mb-2" />
            <p className="text-sm">No booking source assigned</p>
            {editing && (
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Assign Booking Source
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
