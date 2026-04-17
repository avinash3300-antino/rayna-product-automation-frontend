"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Pencil,
  RotateCcw,
  AlertTriangle,
  FileText,
  AlignLeft,
  Search,
  HelpCircle,
  Code,
  Tag,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ContentTabPanel } from "./content-tab-panel";
import type {
  ContentRecord,
  ContentFields,
  ContentTabKey,
  FaqItem,
} from "@/types/content-review";
import type { ProductCategory } from "@/types/destinations";

interface ContentReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ContentRecord | null;
  onApprove: (recordId: string) => void;
  onEditAndApprove: (recordId: string, editedFields: ContentFields) => void;
  onRejectAndRegenerate: (recordId: string) => void;
  onEscalate: (recordId: string) => void;
}

const categoryStyles: Record<ProductCategory, string> = {
  hotels: "border-chart-2/30 text-chart-2",
  attractions: "border-chart-1/30 text-chart-1",
  transfers: "border-blue-500/30 text-blue-600",
  restaurants: "border-chart-4/30 text-chart-4",
};

interface TabConfig {
  key: ContentTabKey;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { key: "short_desc", label: "Short Desc", icon: <FileText className="h-3.5 w-3.5" /> },
  { key: "long_desc", label: "Long Desc", icon: <AlignLeft className="h-3.5 w-3.5" /> },
  { key: "meta", label: "Meta", icon: <Search className="h-3.5 w-3.5" /> },
  { key: "faq", label: "FAQ", icon: <HelpCircle className="h-3.5 w-3.5" /> },
  { key: "schema", label: "Schema", icon: <Code className="h-3.5 w-3.5" /> },
  { key: "tags", label: "Tags", icon: <Tag className="h-3.5 w-3.5" /> },
  { key: "google_review", label: "Google Review", icon: <Star className="h-3.5 w-3.5" /> },
];

function cloneContentFields(fields: ContentFields): ContentFields {
  return {
    shortDesc: fields.shortDesc,
    longDesc: fields.longDesc,
    metaTitle: fields.metaTitle,
    metaDescription: fields.metaDescription,
    faq: fields.faq.map((f) => ({ ...f })),
    schemaMarkup: fields.schemaMarkup,
    tags: [...fields.tags],
    googleReviews: fields.googleReviews.map((r) => ({ ...r })),
  };
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function ContentReviewModal({
  open,
  onOpenChange,
  record,
  onApprove,
  onEditAndApprove,
  onRejectAndRegenerate,
  onEscalate,
}: ContentReviewModalProps) {
  const [activeTab, setActiveTab] = useState<ContentTabKey>("short_desc");
  const [editedFields, setEditedFields] = useState<ContentFields | null>(null);
  const [hasEdits, setHasEdits] = useState(false);

  useEffect(() => {
    if (record) {
      setEditedFields(cloneContentFields(record.contentFields));
      setActiveTab("short_desc");
      setHasEdits(false);
    }
  }, [record]);

  if (!record || !editedFields) return null;

  const isReviewable =
    record.status === "pending" || record.status === "in_review";

  function updateField(updater: (fields: ContentFields) => ContentFields) {
    setEditedFields((prev) => {
      if (!prev) return prev;
      setHasEdits(true);
      return updater(prev);
    });
  }

  function updateFaqItem(
    index: number,
    field: keyof FaqItem,
    value: string
  ) {
    updateField((f) => ({
      ...f,
      faq: f.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle className="text-lg">
              {record.productName}
            </DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                "text-xs capitalize",
                categoryStyles[record.category]
              )}
            >
              {record.category}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs tabular-nums",
                record.generationAttempt >= record.maxAttempts
                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              Attempt {record.generationAttempt} of {record.maxAttempts}
            </Badge>
          </div>
          <DialogDescription>
            {record.destination} · Keyword: &quot;{record.primaryKeyword}
            &quot;
          </DialogDescription>
        </DialogHeader>

        {/* Tab Bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 border-b">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "border-gold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          {/* Short Description */}
          {activeTab === "short_desc" && (
            <ContentTabPanel
              value={editedFields.shortDesc}
              onChange={(v) => updateField((f) => ({ ...f, shortDesc: v }))}
              label="Short Description"
              primaryKeyword={record.primaryKeyword}
              rows={4}
              disabled={!isReviewable}
            />
          )}

          {/* Long Description */}
          {activeTab === "long_desc" && (
            <ContentTabPanel
              value={editedFields.longDesc}
              onChange={(v) => updateField((f) => ({ ...f, longDesc: v }))}
              label="Long Description"
              primaryKeyword={record.primaryKeyword}
              rows={12}
              disabled={!isReviewable}
            />
          )}

          {/* Meta */}
          {activeTab === "meta" && (
            <div className="space-y-4">
              <ContentTabPanel
                value={editedFields.metaTitle}
                onChange={(v) =>
                  updateField((f) => ({ ...f, metaTitle: v }))
                }
                label="Meta Title"
                primaryKeyword={record.primaryKeyword}
                rows={2}
                disabled={!isReviewable}
              />
              <ContentTabPanel
                value={editedFields.metaDescription}
                onChange={(v) =>
                  updateField((f) => ({ ...f, metaDescription: v }))
                }
                label="Meta Description"
                primaryKeyword={record.primaryKeyword}
                rows={3}
                disabled={!isReviewable}
              />
            </div>
          )}

          {/* FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">
                Frequently Asked Questions
              </label>
              {editedFields.faq.map((item, index) => (
                <div
                  key={index}
                  className="rounded-md border p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Q{index + 1}
                    </Badge>
                  </div>
                  <ContentTabPanel
                    value={item.question}
                    onChange={(v) => updateFaqItem(index, "question", v)}
                    label="Question"
                    primaryKeyword={record.primaryKeyword}
                    rows={2}
                    disabled={!isReviewable}
                  />
                  <ContentTabPanel
                    value={item.answer}
                    onChange={(v) => updateFaqItem(index, "answer", v)}
                    label="Answer"
                    primaryKeyword={record.primaryKeyword}
                    rows={3}
                    disabled={!isReviewable}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Schema */}
          {activeTab === "schema" && (
            <ContentTabPanel
              value={editedFields.schemaMarkup}
              onChange={(v) =>
                updateField((f) => ({ ...f, schemaMarkup: v }))
              }
              label="Schema Markup (JSON-LD)"
              primaryKeyword={record.primaryKeyword}
              rows={15}
              monospace
              disabled={!isReviewable}
            />
          )}

          {/* Tags */}
          {activeTab === "tags" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {editedFields.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <ContentTabPanel
                value={editedFields.tags.join(", ")}
                onChange={(v) =>
                  updateField((f) => ({
                    ...f,
                    tags: v
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                label="Edit Tags (comma-separated)"
                primaryKeyword={record.primaryKeyword}
                rows={2}
                disabled={!isReviewable}
              />
            </div>
          )}

          {/* Google Reviews */}
          {activeTab === "google_review" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Google Reviews
                </label>
                <Badge variant="secondary" className="text-xs">
                  {editedFields.googleReviews.length} reviews
                </Badge>
              </div>
              {editedFields.googleReviews.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No Google reviews available for this product
                </div>
              ) : (
                editedFields.googleReviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-md border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {review.reviewer}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </ScrollArea>

        {/* Action Buttons */}
        {isReviewable && (
          <>
            <Separator />
            <div className="px-6 py-4 flex items-center gap-2 flex-wrap">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onApprove(record.id)}
              >
                <Check className="h-4 w-4 mr-1.5" />
                Approve
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() =>
                  onEditAndApprove(record.id, editedFields)
                }
                disabled={!hasEdits}
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit &amp; Approve
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onRejectAndRegenerate(record.id)}
                disabled={
                  record.generationAttempt >= record.maxAttempts
                }
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Reject &amp; Regenerate
                <Badge
                  variant="secondary"
                  className="ml-1.5 text-[10px] bg-white/20 text-white border-0"
                >
                  {record.generationAttempt} of {record.maxAttempts}
                </Badge>
              </Button>
              {record.generationAttempt >= record.maxAttempts && (
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => onEscalate(record.id)}
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Escalate to Copywriter
                </Button>
              )}
            </div>
          </>
        )}

        {/* Read-only info for completed records */}
        {!isReviewable && (
          <>
            <Separator />
            <div className="px-6 py-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className={cn("text-xs", {
                  "bg-emerald-500/10 text-emerald-600":
                    record.status === "approved",
                  "bg-red-500/10 text-red-600":
                    record.status === "rejected",
                  "bg-purple-500/10 text-purple-600":
                    record.status === "escalated",
                })}
              >
                {record.status === "approved"
                  ? "Approved"
                  : record.status === "rejected"
                    ? "Rejected"
                    : "Escalated"}
              </Badge>
              {record.reviewedBy && (
                <span>by {record.reviewedBy}</span>
              )}
              {record.publishFlag && (
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500/30 text-emerald-600"
                >
                  Published
                </Badge>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
