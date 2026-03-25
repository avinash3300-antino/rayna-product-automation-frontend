"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  TravelPackage,
  PackageTypeId,
  BuilderStep,
  PackageComponent,
  PackageGeneratedContent,
} from "@/types/packages";
import { calculatePackagePricing } from "@/types/packages";
import {
  MOCK_PACKAGES,
  PACKAGE_TYPE_DEFINITIONS,
  INITIAL_BUILDER_STATE,
  generatePackageName,
} from "@/lib/mock-packages";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { PackagesTable } from "./packages-table";
import { PackageTypeSelector } from "./package-type-selector";
import { PackageStepper } from "./package-stepper";
import { StepConfigure } from "./steps/step-configure";
import { StepComponents } from "./steps/step-components";
import { StepPricing } from "./steps/step-pricing";
import { StepContent } from "./steps/step-content";
import { StepReview } from "./steps/step-review";

export function PackageBuilder() {
  const [packages, setPackages] = useState<TravelPackage[]>(MOCK_PACKAGES);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderState, setBuilderState] = useState(INITIAL_BUILDER_STATE);

  // ---- Derived data ----
  const selectedTypeDef = useMemo(
    () => PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === builderState.packageTypeId),
    [builderState.packageTypeId]
  );

  const availableProducts = useMemo(
    () =>
      builderState.destination
        ? MOCK_PRODUCTS.filter((p) => p.destination === builderState.destination)
        : [],
    [builderState.destination]
  );

  const calculatedPricing = useMemo(
    () =>
      calculatePackagePricing(
        builderState.selectedComponents,
        builderState.nights,
        builderState.marginPercent,
        builderState.isOverridePrice,
        builderState.overridePrice
      ),
    [
      builderState.selectedComponents,
      builderState.nights,
      builderState.marginPercent,
      builderState.isOverridePrice,
      builderState.overridePrice,
    ]
  );

  // ---- Step validation ----
  const isStepValid = useCallback(
    (step: BuilderStep): boolean => {
      switch (step) {
        case 1:
          return (
            !!builderState.packageTypeId &&
            !!builderState.destination &&
            !!builderState.packageName.trim() &&
            builderState.nights >= (selectedTypeDef?.durationConstraint.minNights ?? 1) &&
            builderState.nights <= (selectedTypeDef?.durationConstraint.maxNights ?? 14)
          );
        case 2: {
          if (!selectedTypeDef) return false;
          const rules = selectedTypeDef.componentRules;
          const counts: Record<string, number> = {};
          for (const c of builderState.selectedComponents) {
            counts[c.category] = (counts[c.category] || 0) + 1;
          }
          for (const cat of selectedTypeDef.requiredCategories) {
            const rule = rules[cat as keyof typeof rules];
            const count = counts[cat] || 0;
            if (count < rule.min) return false;
          }
          return true;
        }
        case 3:
          return builderState.marginPercent >= 0 && builderState.marginPercent <= 100;
        case 4:
          return true; // content generation is optional
        case 5:
          return true;
        default:
          return false;
      }
    },
    [builderState, selectedTypeDef]
  );

  // ---- Navigation ----
  const handleNext = useCallback(() => {
    if (builderState.currentStep < 5 && isStepValid(builderState.currentStep)) {
      setBuilderState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep + 1) as BuilderStep,
      }));
    }
  }, [builderState.currentStep, isStepValid]);

  const handleBack = useCallback(() => {
    if (builderState.currentStep > 1) {
      setBuilderState((prev) => ({
        ...prev,
        currentStep: (prev.currentStep - 1) as BuilderStep,
      }));
    }
  }, [builderState.currentStep]);

  const handleStepClick = useCallback(
    (step: BuilderStep) => {
      if (step < builderState.currentStep) {
        setBuilderState((prev) => ({ ...prev, currentStep: step }));
      }
    },
    [builderState.currentStep]
  );

  // ---- Builder actions ----
  const handleCreateNew = useCallback(() => {
    setBuilderState(INITIAL_BUILDER_STATE);
    setIsBuilderOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsBuilderOpen(false);
    setBuilderState(INITIAL_BUILDER_STATE);
  }, []);

  const handleSelectType = useCallback(
    (typeId: PackageTypeId) => {
      const typeDef = PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === typeId);
      setBuilderState((prev) => ({
        ...prev,
        packageTypeId: typeId,
        marginPercent: typeDef?.suggestedMargin ?? 20,
        packageName: prev.destination
          ? generatePackageName(typeId, prev.destination)
          : prev.packageName,
      }));
    },
    []
  );

  const handleDestinationChange = useCallback(
    (dest: string) => {
      setBuilderState((prev) => ({
        ...prev,
        destination: dest,
        packageName: prev.packageTypeId
          ? generatePackageName(prev.packageTypeId, dest)
          : prev.packageName,
        selectedComponents: [],
        currentStep: prev.currentStep > 1 ? 1 : prev.currentStep,
      }));
    },
    []
  );

  const handleNightsChange = useCallback((nights: number) => {
    setBuilderState((prev) => ({ ...prev, nights }));
  }, []);

  const handlePackageNameChange = useCallback((name: string) => {
    setBuilderState((prev) => ({ ...prev, packageName: name }));
  }, []);

  const handleComponentsChange = useCallback((components: PackageComponent[]) => {
    setBuilderState((prev) => ({ ...prev, selectedComponents: components }));
  }, []);

  const handleMarginChange = useCallback((margin: number) => {
    setBuilderState((prev) => ({ ...prev, marginPercent: margin }));
  }, []);

  const handleOverrideToggle = useCallback((enabled: boolean) => {
    setBuilderState((prev) => ({
      ...prev,
      isOverridePrice: enabled,
      overridePrice: enabled ? prev.overridePrice : null,
    }));
  }, []);

  const handleOverridePriceChange = useCallback((price: number | null) => {
    setBuilderState((prev) => ({ ...prev, overridePrice: price }));
  }, []);

  // ---- AI Content Generation (simulated) ----
  const handleGenerateContent = useCallback(() => {
    setBuilderState((prev) => ({ ...prev, isGenerating: true }));

    setTimeout(() => {
      const hotels = builderState.selectedComponents.filter((c) => c.category === "hotels");
      const attractions = builderState.selectedComponents.filter((c) => c.category === "attractions");
      const days = builderState.nights + 1;

      const itinerary = Array.from({ length: days }, (_, i) => {
        if (i === 0) {
          return {
            day: 1,
            title: "Arrival & Check-in",
            description: `Arrive in ${builderState.destination} and check into ${hotels[0]?.product.name || "your hotel"}.`,
            activities: ["Airport transfer", "Hotel check-in", "Evening at leisure"],
          };
        }
        if (i === days - 1) {
          return {
            day: days,
            title: "Departure",
            description: "Enjoy a leisurely morning before your transfer to the airport.",
            activities: ["Hotel checkout", "Airport transfer"],
          };
        }
        const dayAttractions = attractions.slice(
          (i - 1) * 2,
          (i - 1) * 2 + 2
        );
        return {
          day: i + 1,
          title: `Day ${i + 1} – Explore`,
          description: `Discover ${builderState.destination}'s highlights.`,
          activities: dayAttractions.length > 0
            ? dayAttractions.map((a) => a.product.name)
            : ["Free time to explore"],
        };
      });

      const content: PackageGeneratedContent = {
        name: builderState.packageName,
        description: `Experience the best of ${builderState.destination} with this carefully curated ${builderState.nights}-night package. ${
          hotels[0]
            ? `Stay at the luxurious ${hotels[0].product.name}`
            : "Enjoy premium accommodation"
        } and explore ${attractions.length} hand-picked attractions${
          attractions.length > 0
            ? ` including ${attractions.map((a) => a.product.name).join(", ")}`
            : ""
        }.`,
        itinerary,
        suggestedTags: [
          { dimension: "travel_theme", value: "Sightseeing" },
          { dimension: "budget_tier", value: hotels[0]?.product.tags.find((t) => t.dimension === "budget_tier")?.value || "Mid-range" },
          { dimension: "audience", value: "Couples" },
        ],
        isGenerated: true,
      };

      setBuilderState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedContent: content,
      }));
    }, 2000);
  }, [builderState.selectedComponents, builderState.destination, builderState.nights, builderState.packageName]);

  const handleContentChange = useCallback((content: PackageGeneratedContent) => {
    setBuilderState((prev) => ({ ...prev, generatedContent: content }));
  }, []);

  // ---- Save / Submit ----
  const savePackage = useCallback(
    (status: "draft" | "pending_approval") => {
      const newPkg: TravelPackage = {
        id: `pkg-${Date.now()}`,
        name: builderState.packageName,
        packageTypeId: builderState.packageTypeId!,
        destination: builderState.destination,
        nights: builderState.nights,
        days: builderState.nights + 1,
        status,
        components: builderState.selectedComponents,
        pricing: calculatedPricing,
        content: builderState.generatedContent ?? {
          name: builderState.packageName,
          description: "",
          itinerary: [],
          suggestedTags: [],
          isGenerated: false,
        },
        tags: builderState.generatedContent?.suggestedTags ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (builderState.isEditing && builderState.editingPackageId) {
        setPackages((prev) =>
          prev.map((p) =>
            p.id === builderState.editingPackageId ? { ...newPkg, id: p.id, createdAt: p.createdAt } : p
          )
        );
      } else {
        setPackages((prev) => [newPkg, ...prev]);
      }

      setIsBuilderOpen(false);
      setBuilderState(INITIAL_BUILDER_STATE);
    },
    [builderState, calculatedPricing]
  );

  // ---- Table actions ----
  const handleEdit = useCallback(
    (id: string) => {
      const pkg = packages.find((p) => p.id === id);
      if (!pkg) return;
      setBuilderState({
        currentStep: 1,
        isEditing: true,
        editingPackageId: id,
        packageName: pkg.name,
        packageTypeId: pkg.packageTypeId,
        destination: pkg.destination,
        nights: pkg.nights,
        selectedComponents: pkg.components,
        marginPercent: pkg.pricing.marginPercent,
        isOverridePrice: pkg.pricing.isOverridden,
        overridePrice: pkg.pricing.overridePrice,
        generatedContent: pkg.content.isGenerated ? pkg.content : null,
        isGenerating: false,
      });
      setIsBuilderOpen(true);
    },
    [packages]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const pkg = packages.find((p) => p.id === id);
      if (!pkg) return;
      const dup: TravelPackage = {
        ...pkg,
        id: `pkg-${Date.now()}`,
        name: `${pkg.name} (Copy)`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPackages((prev) => [dup, ...prev]);
    },
    [packages]
  );

  const handleDelete = useCallback((id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---- Render active step ----
  const renderStep = () => {
    switch (builderState.currentStep) {
      case 1:
        return (
          <StepConfigure
            packageName={builderState.packageName}
            packageTypeId={builderState.packageTypeId}
            destination={builderState.destination}
            nights={builderState.nights}
            onPackageNameChange={handlePackageNameChange}
            onDestinationChange={handleDestinationChange}
            onNightsChange={handleNightsChange}
          />
        );
      case 2:
        return (
          <StepComponents
            destination={builderState.destination}
            selectedComponents={builderState.selectedComponents}
            componentRules={
              selectedTypeDef?.componentRules ?? {
                hotels: { min: 0, max: 5 },
                attractions: { min: 0, max: 10 },
                transfers: { min: 0, max: 5 },
                restaurants: { min: 0, max: 5 },
              }
            }
            availableProducts={availableProducts}
            onComponentsChange={handleComponentsChange}
          />
        );
      case 3:
        return (
          <StepPricing
            pricing={calculatedPricing}
            onMarginChange={handleMarginChange}
            onOverrideToggle={handleOverrideToggle}
            onOverridePriceChange={handleOverridePriceChange}
          />
        );
      case 4:
        return (
          <StepContent
            generatedContent={builderState.generatedContent}
            isGenerating={builderState.isGenerating}
            onGenerate={handleGenerateContent}
            onContentChange={handleContentChange}
          />
        );
      case 5:
        return (
          <StepReview
            packageName={builderState.packageName}
            packageTypeId={builderState.packageTypeId}
            destination={builderState.destination}
            nights={builderState.nights}
            components={builderState.selectedComponents}
            pricing={calculatedPricing}
            content={builderState.generatedContent}
            onSaveDraft={() => savePackage("draft")}
            onSubmitForApproval={() => savePackage("pending_approval")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Package Builder</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage travel packages with automated pricing and AI content.
          </p>
        </div>
        {!isBuilderOpen && (
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Package
          </Button>
        )}
        {isBuilderOpen && (
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Packages Table */}
      {!isBuilderOpen && (
        <PackagesTable
          packages={packages}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

      {/* Builder */}
      {isBuilderOpen && (
        <Card className="p-6">
          <div className="flex gap-6">
            {/* Left Panel - Type Selector (Step 1 only) */}
            {builderState.currentStep === 1 && (
              <div className="hidden lg:block">
                <PackageTypeSelector
                  selectedTypeId={builderState.packageTypeId}
                  onSelectType={handleSelectType}
                />
              </div>
            )}

            {/* Right Panel - Stepper + Step Content */}
            <div className="flex-1 min-w-0">
              <PackageStepper
                currentStep={builderState.currentStep}
                onStepClick={handleStepClick}
              />

              {renderStep()}

              {/* Navigation Buttons */}
              {builderState.currentStep < 5 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={builderState.currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid(builderState.currentStep)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
