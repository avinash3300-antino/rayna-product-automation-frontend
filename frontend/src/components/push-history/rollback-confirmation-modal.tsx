"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { PushBatch } from "@/types/push-history";

interface RollbackConfirmationModalProps {
  batch: PushBatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (batchId: string, reason: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RollbackConfirmationModal({
  batch,
  open,
  onOpenChange,
  onConfirm,
}: RollbackConfirmationModalProps) {
  const [reason, setReason] = useState("");
  const [understood, setUnderstood] = useState(false);

  if (!batch) return null;

  const totalAffected = batch.records.created + batch.records.updated;
  const isValid = reason.trim().length >= 20 && understood;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(batch.id, reason);
    setReason("");
    setUnderstood(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setReason("");
      setUnderstood(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-navy border-border/50 sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Confirm Rollback
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This action will reverse all changes made by this push batch.
          </DialogDescription>
        </DialogHeader>

        {/* Batch Summary */}
        <div className="rounded-lg border border-border/50 bg-navy-light/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Batch ID</span>
            <span className="font-mono text-sm text-gold">
              {batch.id.substring(0, 16)}...
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Destination</span>
            <span className="text-sm text-foreground">{batch.destination}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Environment</span>
            <Badge
              variant="outline"
              className={
                batch.environment === "production"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }
            >
              {batch.environment}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Triggered At</span>
            <span className="text-sm text-foreground">
              {formatDate(batch.triggeredAt)}
            </span>
          </div>
        </div>

        {/* Impact Warning */}
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-2">
          <p className="text-sm font-medium text-red-400">
            This will affect {totalAffected} products:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li className="flex items-center gap-2">
              <Plus className="h-3 w-3 text-emerald-400" />
              Soft-delete {batch.records.created} newly created records
            </li>
            <li className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-blue-400" />
              Restore {batch.records.updated} previously updated records to
              prior version
            </li>
          </ul>
        </div>

        {/* Reason */}
        <div>
          <Label
            htmlFor="rollback-reason"
            className="text-sm text-muted-foreground"
          >
            Reason for rollback{" "}
            <span className="text-red-400">* (min 20 characters)</span>
          </Label>
          <Textarea
            id="rollback-reason"
            placeholder="Explain why this batch needs to be rolled back..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 bg-navy-light/50 border-border/50 focus:border-gold/50 min-h-[80px]"
          />
          {reason.length > 0 && reason.length < 20 && (
            <p className="text-xs text-red-400 mt-1">
              {20 - reason.length} more characters required
            </p>
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="understand-rollback"
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="understand-rollback"
            className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            I understand this action cannot be undone without re-running the
            ingestion job
          </Label>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Confirm Rollback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
