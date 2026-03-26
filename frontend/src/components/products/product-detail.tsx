"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductOverviewTab } from "./product-overview-tab";
import { ProductAttributesTab } from "./product-attributes-tab";
import { ProductContentTab } from "./product-content-tab";
import { ProductMediaTab } from "./product-media-tab";
import { ProductTagsTab } from "./product-tags-tab";
import { ProductBookingTab } from "./product-booking-tab";
import { ProductQualityTab } from "./product-quality-tab";
import { ProductHistoryTab } from "./product-history-tab";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import type { ProductStatus } from "@/types/products";

interface ProductDetailProps {
  productId: string;
}

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  staged: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Product not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mt-0.5"
            onClick={() => router.push("/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight">
                {product.name}
              </h2>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs capitalize",
                  statusStyles[product.status]
                )}
              >
                {product.status}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {product.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {product.destination} &middot; {product.completeness}% complete
            </p>
          </div>
        </div>

        <Button
          variant={editing ? "default" : "outline"}
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => setEditing((prev) => !prev)}
        >
          {editing ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              View Mode
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" />
              Edit Mode
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="booking">Booking Sources</TabsTrigger>
          <TabsTrigger value="quality">Quality Checks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProductOverviewTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="attributes">
          <ProductAttributesTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="content">
          <ProductContentTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="media">
          <ProductMediaTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="tags">
          <ProductTagsTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="booking">
          <ProductBookingTab product={product} editing={editing} />
        </TabsContent>

        <TabsContent value="quality">
          <ProductQualityTab product={product} />
        </TabsContent>

        <TabsContent value="history">
          <ProductHistoryTab product={product} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
