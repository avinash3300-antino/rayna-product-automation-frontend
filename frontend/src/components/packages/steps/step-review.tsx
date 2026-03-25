"use client";

import { Save, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PackageComponent, PackagePricing, PackageGeneratedContent, PackageTypeId } from "@/types/packages";
import { PackageSummaryCard } from "../package-summary-card";

interface StepReviewProps {
  packageName: string;
  packageTypeId: PackageTypeId | null;
  destination: string;
  nights: number;
  components: PackageComponent[];
  pricing: PackagePricing;
  content: PackageGeneratedContent | null;
  onSaveDraft: () => void;
  onSubmitForApproval: () => void;
}

export function StepReview({
  packageName,
  packageTypeId,
  destination,
  nights,
  components,
  pricing,
  content,
  onSaveDraft,
  onSubmitForApproval,
}: StepReviewProps) {
  return (
    <div className="space-y-6">
      <PackageSummaryCard
        packageName={packageName}
        packageTypeId={packageTypeId}
        destination={destination}
        nights={nights}
        components={components}
        pricing={pricing}
        content={content}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={onSubmitForApproval}>
          <SendHorizontal className="h-4 w-4 mr-2" />
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}
