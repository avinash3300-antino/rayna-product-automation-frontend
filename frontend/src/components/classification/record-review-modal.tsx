"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { JsonViewer } from "./json-viewer";
import { ConfidenceGauge } from "./confidence-gauge";
import type {
  ClassificationRecord,
  ReviewDecision,
  ReviewFormState,
} from "@/types/classification";
import type { ProductCategory } from "@/types/destinations";

interface RecordReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ClassificationRecord | null;
  onSubmit: (
    recordId: string,
    decision: ReviewDecision,
    form: ReviewFormState
  ) => void;
}

const categoryStyles: Record<ProductCategory, string> = {
  hotels: "border-chart-2/30 text-chart-2",
  attractions: "border-chart-1/30 text-chart-1",
  transfers: "border-blue-500/30 text-blue-600",
  restaurants: "border-chart-4/30 text-chart-4",
};

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "hotels", label: "Hotels" },
  { value: "attractions", label: "Attractions" },
  { value: "transfers", label: "Transfers" },
  { value: "restaurants", label: "Restaurants" },
];

export function RecordReviewModal({
  open,
  onOpenChange,
  record,
  onSubmit,
}: RecordReviewModalProps) {
  const [form, setForm] = useState<ReviewFormState>({
    finalCategory: "hotels",
    notes: "",
  });

  useEffect(() => {
    if (record) {
      setForm({
        finalCategory: record.predictedCategory,
        notes: "",
      });
    }
  }, [record]);

  if (!record) return null;

  function handleSubmit(decision: ReviewDecision) {
    onSubmit(record!.id, decision, form);
  }

  const isReviewable =
    record.status === "pending" || record.status === "in_review";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>
            Review — {record.normalizedPayload.name}
          </DialogTitle>
          <DialogDescription>
            {record.source} · {record.destination} · Created{" "}
            {new Date(record.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border-t mt-4">
          {/* Left Panel: Raw JSON */}
          <div className="border-r overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">
                Normalized Payload
              </h3>
              <p className="text-xs text-muted-foreground">
                Raw ingested data with syntax highlighting
              </p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <JsonViewer data={record.normalizedPayload} />
            </ScrollArea>
          </div>

          {/* Right Panel: Classification + Review Form */}
          <div className="overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-semibold">
                Classification Details
              </h3>
              <p className="text-xs text-muted-foreground">
                AI prediction and human review
              </p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-5">
                {/* Predicted Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Predicted Category
                  </Label>
                  <div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm capitalize px-3 py-1",
                        categoryStyles[record.predictedCategory]
                      )}
                    >
                      {record.predictedCategory}
                    </Badge>
                  </div>
                </div>

                {/* Confidence */}
                <ConfidenceGauge score={record.confidenceScore} />

                {/* Rationale */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Classifier Rationale
                  </Label>
                  <div className="rounded-md border bg-muted/30 p-3">
                    <p className="text-sm leading-relaxed">
                      {record.classifierRationale}
                    </p>
                  </div>
                </div>

                {isReviewable && (
                  <>
                    <Separator />

                    {/* Final Category Radio Buttons */}
                    <div className="space-y-3">
                      <Label className="text-xs text-muted-foreground">
                        Final Category
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORY_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex items-center gap-2 rounded-md border px-3 py-2.5 cursor-pointer transition-colors",
                              form.finalCategory === option.value
                                ? "border-gold bg-gold/5 text-foreground"
                                : "border-border hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <input
                              type="radio"
                              name="finalCategory"
                              value={option.value}
                              checked={
                                form.finalCategory === option.value
                              }
                              onChange={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  finalCategory: option.value,
                                }))
                              }
                              className="accent-gold"
                            />
                            <span className="text-sm font-medium">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Notes
                      </Label>
                      <textarea
                        value={form.notes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Add review notes (optional)..."
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleSubmit("approve")}
                      >
                        <Check className="h-4 w-4 mr-1.5" />
                        Approve
                      </Button>
                      <Button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleSubmit("reject")}
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        Reject
                      </Button>
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => handleSubmit("escalate")}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1.5" />
                        Escalate
                      </Button>
                    </div>
                  </>
                )}

                {/* Show existing review info for completed records */}
                {!isReviewable && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Final Category
                        </Label>
                        <div>
                          {record.finalCategory ? (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-sm capitalize px-3 py-1",
                                categoryStyles[record.finalCategory]
                              )}
                            >
                              {record.finalCategory}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Not set
                            </span>
                          )}
                        </div>
                      </div>
                      {record.reviewNotes && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Review Notes
                          </Label>
                          <div className="rounded-md border bg-muted/30 p-3">
                            <p className="text-sm">
                              {record.reviewNotes}
                            </p>
                          </div>
                        </div>
                      )}
                      {record.reviewedBy && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Reviewed By
                          </Label>
                          <p className="text-sm">{record.reviewedBy}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
