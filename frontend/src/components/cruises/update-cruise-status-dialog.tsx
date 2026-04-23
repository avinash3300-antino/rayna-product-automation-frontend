"use client";

import { useState } from "react";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUpdateCruiseStatus } from "@/hooks/api/use-cruises";
import type { Cruise, CruiseStatus } from "@/types/cruises";

interface UpdateCruiseStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cruise: Cruise | null;
}

const STATUS_OPTIONS: { value: CruiseStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "enriched", label: "Enriched" },
  { value: "review_ready", label: "Review Ready" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const statusStyles: Record<CruiseStatus, string> = {
  draft: "bg-muted text-muted-foreground border-muted",
  enriched: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  review_ready: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  published: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
};

export function UpdateCruiseStatusDialog({
  open,
  onOpenChange,
  cruise,
}: UpdateCruiseStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<CruiseStatus | null>(
    null
  );
  const updateStatus = useUpdateCruiseStatus();

  const currentStatus = cruise?.status ?? "draft";
  const effectiveSelected = selectedStatus ?? currentStatus;

  const handleSave = () => {
    if (!cruise || !selectedStatus || selectedStatus === currentStatus) return;

    updateStatus.mutate(
      { cruiseId: cruise.id, status: selectedStatus },
      {
        onSuccess: () => {
          toast.success(`Status changed to "${selectedStatus.replace("_", " ")}"`);
          onOpenChange(false);
          setSelectedStatus(null);
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setSelectedStatus(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Change Cruise Status
          </DialogTitle>
          <DialogDescription>
            Current status:{" "}
            <Badge
              variant="secondary"
              className={cn(
                "text-xs capitalize ml-1",
                statusStyles[currentStatus]
              )}
            >
              {currentStatus.replace("_", " ")}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <p className="text-sm text-muted-foreground mb-3">
            Select the new status:
          </p>
          <div className="grid gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isActive = effectiveSelected === option.value;
              const isCurrent = currentStatus === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-colors",
                    isActive
                      ? "border-[#C9A84C] bg-[#C9A84C]/5 ring-1 ring-[#C9A84C]/30"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full border-2 transition-colors",
                        isActive
                          ? "border-[#C9A84C] bg-[#C9A84C]"
                          : "border-muted-foreground/40"
                      )}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              updateStatus.isPending ||
              !selectedStatus ||
              selectedStatus === currentStatus
            }
          >
            {updateStatus.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
