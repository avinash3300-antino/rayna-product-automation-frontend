"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Hotel,
  Ticket,
  Car,
  UtensilsCrossed,
  Download,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Eye,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSelector } from "./product-selector";
import { HotelForm } from "./hotel-form";
import { AttractionForm } from "./attraction-form";
import { TransferForm } from "./transfer-form";
import { RestaurantForm } from "./restaurant-form";
import { BulkEditPanel, type BulkEditChanges } from "./bulk-edit-panel";
import { EnrichmentQueue } from "./enrichment-queue";
import type {
  AttributeCategory,
  AttributeProduct,
  HotelAttributes,
  AttractionAttributes,
  TransferAttributes,
  RestaurantAttributes,
} from "@/types/attributes";
import { STATUS_COLORS } from "@/types/attributes";
import {
  MOCK_ATTRIBUTE_PRODUCTS,
  MOCK_ENRICHMENT_QUEUE,
} from "@/lib/mock-attributes";

const CATEGORY_TABS: {
  value: AttributeCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "hotels", label: "Hotels", icon: <Hotel className="h-4 w-4" /> },
  {
    value: "attractions",
    label: "Attractions",
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    value: "transfers",
    label: "Transfers",
    icon: <Car className="h-4 w-4" />,
  },
  {
    value: "restaurants",
    label: "Restaurants",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
];

export function AttributeEditor() {
  const [activeCategory, setActiveCategory] =
    useState<AttributeCategory>("hotels");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // State for all products (mutable for edits)
  const [allProducts, setAllProducts] = useState<
    Record<string, AttributeProduct[]>
  >(() => JSON.parse(JSON.stringify(MOCK_ATTRIBUTE_PRODUCTS)));

  const currentProducts = useMemo(
    () => allProducts[activeCategory] || [],
    [allProducts, activeCategory]
  );

  const selectedProduct = useMemo(
    () => currentProducts.find((p) => p.id === selectedProductId) || null,
    [currentProducts, selectedProductId]
  );

  const bulkSelectedProducts = useMemo(
    () => currentProducts.filter((p) => bulkSelectedIds.includes(p.id)),
    [currentProducts, bulkSelectedIds]
  );

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat as AttributeCategory);
    setSelectedProductId(null);
    setEditMode(false);
    setHasChanges(false);
    setBulkSelectedIds([]);
  }, []);

  const handleProductSelect = useCallback((id: string) => {
    setSelectedProductId(id);
    setEditMode(false);
    setHasChanges(false);
  }, []);

  const handleToggleBulkSelect = useCallback((id: string) => {
    setBulkSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleAttributeChange = useCallback(
    (
      attrs:
        | HotelAttributes
        | AttractionAttributes
        | TransferAttributes
        | RestaurantAttributes
    ) => {
      if (!selectedProductId) return;
      setAllProducts((prev) => {
        const updated = { ...prev };
        updated[activeCategory] = updated[activeCategory].map((p) =>
          p.id === selectedProductId ? { ...p, attributes: attrs } : p
        );
        return updated;
      });
      setHasChanges(true);
    },
    [selectedProductId, activeCategory]
  );

  const handleSave = useCallback(() => {
    setHasChanges(false);
    setEditMode(false);
  }, []);

  const handleExportSchema = useCallback(() => {
    const data = allProducts[activeCategory];
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeCategory}-schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allProducts, activeCategory]);

  const handleBulkApply = useCallback(
    (changes: BulkEditChanges) => {
      setAllProducts((prev) => {
        const updated = { ...prev };
        updated[activeCategory] = updated[activeCategory].map((p) => {
          if (!bulkSelectedIds.includes(p.id)) return p;
          const attrs = { ...p.attributes };
          Object.entries(changes).forEach(([key, value]) => {
            if (value !== undefined) {
              (attrs as Record<string, unknown>)[key] = value;
            }
          });
          return { ...p, attributes: attrs };
        });
        return updated;
      });
      setBulkMode(false);
      setBulkSelectedIds([]);
    },
    [activeCategory, bulkSelectedIds]
  );

  const handleEnrichmentSelect = useCallback(
    (productId: string) => {
      // Find which category this product belongs to
      for (const [cat, products] of Object.entries(allProducts)) {
        if (products.find((p) => p.id === productId)) {
          setActiveCategory(cat as AttributeCategory);
          setSelectedProductId(productId);
          setEditMode(true);
          setBulkMode(false);
          return;
        }
      }
    },
    [allProducts]
  );

  const renderForm = () => {
    if (!selectedProduct) return null;

    switch (activeCategory) {
      case "hotels":
        return (
          <HotelForm
            attributes={selectedProduct.attributes as HotelAttributes}
            editMode={editMode}
            onChange={handleAttributeChange}
          />
        );
      case "attractions":
        return (
          <AttractionForm
            attributes={selectedProduct.attributes as AttractionAttributes}
            editMode={editMode}
            onChange={handleAttributeChange}
          />
        );
      case "transfers":
        return (
          <TransferForm
            attributes={selectedProduct.attributes as TransferAttributes}
            editMode={editMode}
            onChange={handleAttributeChange}
          />
        );
      case "restaurants":
        return (
          <RestaurantForm
            attributes={selectedProduct.attributes as RestaurantAttributes}
            editMode={editMode}
            onChange={handleAttributeChange}
          />
        );
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Attribute Editor
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage product attribute schemas across all categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`h-8 gap-1.5 text-xs ${
              bulkMode
                ? "bg-gold/10 border-gold/40 text-gold"
                : ""
            }`}
            onClick={() => {
              setBulkMode(!bulkMode);
              setBulkSelectedIds([]);
              if (bulkMode) setSelectedProductId(null);
            }}
          >
            {bulkMode ? (
              <ToggleRight className="h-3.5 w-3.5" />
            ) : (
              <ToggleLeft className="h-3.5 w-3.5" />
            )}
            Bulk Edit Mode
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleExportSchema}
          >
            <Download className="h-3.5 w-3.5" />
            Export Schema
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        <TabsList className="bg-navy-dark/30 border border-border h-10">
          {CATEGORY_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 data-[state=active]:bg-gold data-[state=active]:text-navy-dark text-sm"
            >
              {tab.icon}
              {tab.label}
              <Badge
                variant="outline"
                className="ml-1 text-[10px] h-4 px-1.5"
              >
                {(allProducts[tab.value] || []).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Main content: Left Panel + Right Panel */}
      <div className="flex gap-4" style={{ minHeight: "calc(100vh - 280px)" }}>
        {/* LEFT PANEL - Product Selector */}
        <div className="w-80 shrink-0 border border-border rounded-lg overflow-hidden bg-card">
          <ProductSelector
            products={currentProducts}
            selectedId={selectedProductId}
            onSelect={handleProductSelect}
            bulkMode={bulkMode}
            selectedIds={bulkSelectedIds}
            onToggleSelect={handleToggleBulkSelect}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 min-w-0">
          {bulkMode ? (
            bulkSelectedIds.length > 0 ? (
              <div className="border border-border rounded-lg bg-card overflow-hidden h-full">
                <BulkEditPanel
                  selectedProducts={bulkSelectedProducts}
                  onApply={handleBulkApply}
                  onCancel={() => {
                    setBulkMode(false);
                    setBulkSelectedIds([]);
                  }}
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg bg-card flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                    <Sparkles className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-sm font-semibold">Bulk Edit Mode</h3>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    Select products from the left panel using checkboxes to
                    begin bulk editing
                  </p>
                </div>
              </div>
            )
          ) : selectedProduct ? (
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              {/* Product top bar */}
              <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{selectedProduct.name}</h3>
                  <Badge
                    variant="outline"
                    className="capitalize text-[11px] bg-navy-light/50 text-gold border-gold/30"
                  >
                    {selectedProduct.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`capitalize text-[11px] ${
                      STATUS_COLORS[selectedProduct.status]
                    }`}
                  >
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 gap-1.5 text-xs ${
                      editMode
                        ? "bg-gold/10 border-gold/40 text-gold"
                        : ""
                    }`}
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <Pencil className="h-3.5 w-3.5" /> Edit Mode
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> View Mode
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 text-xs btn-gold"
                    disabled={!editMode || !hasChanges}
                    onClick={handleSave}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs btn-ghost-gold"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Mark for Enrichment
                  </Button>
                </div>
              </div>

              {/* Form content */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 360px)" }}>
                {renderForm()}
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg bg-card flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  {activeCategory === "hotels" && (
                    <Hotel className="h-6 w-6 text-muted-foreground" />
                  )}
                  {activeCategory === "attractions" && (
                    <Ticket className="h-6 w-6 text-muted-foreground" />
                  )}
                  {activeCategory === "transfers" && (
                    <Car className="h-6 w-6 text-muted-foreground" />
                  )}
                  {activeCategory === "restaurants" && (
                    <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-sm font-semibold">No product selected</h3>
                <p className="text-xs text-muted-foreground max-w-[240px]">
                  Select a product from the left panel to view and edit its
                  attributes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enrichment Queue Drawer */}
      <EnrichmentQueue
        entries={MOCK_ENRICHMENT_QUEUE}
        onSelectProduct={handleEnrichmentSelect}
      />
    </div>
  );
}
