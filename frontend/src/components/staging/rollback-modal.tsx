"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Minus, RotateCcw } from "lucide-react";
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
import type { PushHistoryEntry } from "@/types/staging";

interface RollbackModalProps {
  entry: PushHistoryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (entryId: string, reason: string) => void;
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

export function RollbackModal({
  entry,
  open,
  onOpenChange,
  onConfirm,
}: RollbackModalProps) {
  const [reason, setReason] = useState("");

  if (!entry) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(entry.id, reason);
    setReason("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setReason("");
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-navy border-border/50 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            Rollback Batch
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This action will reverse the changes made by this push.
          </DialogDescription>
        </DialogHeader>

        {/* Batch Summary */}
        <div className="rounded-lg border border-border/50 bg-navy-light/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Batch ID</span>
            <span className="font-mono text-sm text-gold">
              {entry.batchId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Destination</span>
            <span className="text-sm text-foreground">
              {entry.destination}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Environment</span>
            <Badge
              variant="outline"
              className={
                entry.environment === "production"
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
              }
            >
              {entry.environment}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pushed At</span>
            <span className="text-sm text-foreground">
              {formatDate(entry.pushedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Records</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <Plus className="h-3 w-3" />
                {entry.records.created} created
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <Minus className="h-3 w-3" />
                {entry.records.updated} updated
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
          <p className="text-sm text-orange-400">
            This will soft-delete{" "}
            <strong>{entry.records.created}</strong> created records and
            restore <strong>{entry.records.updated}</strong> updated records.
          </p>
        </div>

        {/* Reason */}
        <div>
          <Label
            htmlFor="rollback-reason"
            className="text-sm text-muted-foreground"
          >
            Reason for rollback <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="rollback-reason"
            placeholder="Explain why this batch needs to be rolled back..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 bg-navy-light/50 border-border/50 focus:border-gold/50 min-h-[80px]"
          />
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
            disabled={!reason.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Confirm Rollback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
