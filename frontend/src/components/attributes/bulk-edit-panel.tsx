"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AttributeProduct,
  CancellationPolicy,
  BoardType,
} from "@/types/attributes";
import type { ProductStatus } from "@/types/products";

const BOARD_TYPES: BoardType[] = ["RO", "BB", "HB", "FB", "AI"];
const CANCELLATION_OPTIONS: CancellationPolicy[] = [
  "Free",
  "Non-Refundable",
  "Partial",
];
const STATUS_OPTIONS: ProductStatus[] = [
  "draft",
  "staged",
  "published",
  "archived",
];

interface BulkEditPanelProps {
  selectedProducts: AttributeProduct[];
  onApply: (changes: BulkEditChanges) => void;
  onCancel: () => void;
}

export interface BulkEditChanges {
  cancellationPolicy?: CancellationPolicy;
  boardTypes?: BoardType[];
  status?: ProductStatus;
  tags?: { dimension: string; value: string }[];
}

export function BulkEditPanel({
  selectedProducts,
  onApply,
  onCancel,
}: BulkEditPanelProps) {
  const [changes, setChanges] = useState<BulkEditChanges>({});
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [boardTypes, setBoardTypes] = useState<BoardType[]>([]);

  const toggleField = (field: string) => {
    setEditingFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
        const newChanges = { ...changes };
        delete newChanges[field as keyof BulkEditChanges];
        setChanges(newChanges);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const toggleBoardType = (bt: BoardType) => {
    const next = boardTypes.includes(bt)
      ? boardTypes.filter((b) => b !== bt)
      : [...boardTypes, bt];
    setBoardTypes(next);
    setChanges((prev) => ({ ...prev, boardTypes: next }));
  };

  const hasChanges =
    Object.keys(changes).length > 0 &&
    Object.values(changes).some((v) => v !== undefined);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Bulk Edit</h3>
          <Badge
            variant="outline"
            className="bg-gold/10 text-gold border-gold/30"
          >
            {selectedProducts.length} selected
          </Badge>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-600">
            Bulk edit will overwrite selected field on all{" "}
            <strong>{selectedProducts.length}</strong> selected products. This
            cannot be undone.
          </p>
        </div>
      </div>

      {/* Edit fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Cancellation Policy */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            editingFields.has("cancellationPolicy")
              ? "border-gold/40 bg-gold/5"
              : "border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Cancellation Policy</Label>
            <button
              onClick={() => toggleField("cancellationPolicy")}
              className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                editingFields.has("cancellationPolicy")
                  ? "bg-gold border-gold text-navy-dark"
                  : "border-muted-foreground/30"
              }`}
            >
              {editingFields.has("cancellationPolicy") && (
                <Check className="h-3 w-3" />
              )}
            </button>
          </div>
          {editingFields.has("cancellationPolicy") && (
            <Select
              value={changes.cancellationPolicy || ""}
              onValueChange={(val) =>
                setChanges((prev) => ({
                  ...prev,
                  cancellationPolicy: val as CancellationPolicy,
                }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select policy..." />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Board Types */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            editingFields.has("boardTypes")
              ? "border-gold/40 bg-gold/5"
              : "border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Board Types</Label>
            <button
              onClick={() => toggleField("boardTypes")}
              className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                editingFields.has("boardTypes")
                  ? "bg-gold border-gold text-navy-dark"
                  : "border-muted-foreground/30"
              }`}
            >
              {editingFields.has("boardTypes") && (
                <Check className="h-3 w-3" />
              )}
            </button>
          </div>
          {editingFields.has("boardTypes") && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {BOARD_TYPES.map((bt) => (
                <button
                  key={bt}
                  onClick={() => toggleBoardType(bt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    boardTypes.includes(bt)
                      ? "bg-gold text-navy-dark"
                      : "bg-navy-light text-white border border-gold/20 hover:border-gold/40"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            editingFields.has("status")
              ? "border-gold/40 bg-gold/5"
              : "border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Status</Label>
            <button
              onClick={() => toggleField("status")}
              className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                editingFields.has("status")
                  ? "bg-gold border-gold text-navy-dark"
                  : "border-muted-foreground/30"
              }`}
            >
              {editingFields.has("status") && <Check className="h-3 w-3" />}
            </button>
          </div>
          {editingFields.has("status") && (
            <Select
              value={changes.status || ""}
              onValueChange={(val) =>
                setChanges((prev) => ({
                  ...prev,
                  status: val as ProductStatus,
                }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt} className="capitalize">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tags placeholder */}
        <div
          className={`p-3 rounded-lg border transition-all ${
            editingFields.has("tags")
              ? "border-gold/40 bg-gold/5"
              : "border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Tags</Label>
            <button
              onClick={() => toggleField("tags")}
              className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                editingFields.has("tags")
                  ? "bg-gold border-gold text-navy-dark"
                  : "border-muted-foreground/30"
              }`}
            >
              {editingFields.has("tags") && <Check className="h-3 w-3" />}
            </button>
          </div>
          {editingFields.has("tags") && (
            <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Tag editing will be available via the Tag Manager integration
              </span>
            </div>
          )}
        </div>

        {/* Selected products summary */}
        <div className="pt-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Selected Products
          </h4>
          <div className="space-y-1">
            {selectedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/30"
              >
                <span className="text-xs truncate">{p.name}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  {p.destination}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1 btn-gold"
          disabled={!hasChanges}
          onClick={() => onApply(changes)}
        >
          Apply to {selectedProducts.length} Product
          {selectedProducts.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}
