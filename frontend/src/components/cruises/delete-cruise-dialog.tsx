"use client";

import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCruise } from "@/hooks/api/use-cruises";
import type { Cruise } from "@/types/cruises";

interface DeleteCruiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cruise: Cruise | null;
}

export function DeleteCruiseDialog({
  open,
  onOpenChange,
  cruise,
}: DeleteCruiseDialogProps) {
  const router = useRouter();
  const deleteCruise = useDeleteCruise();

  const handleDelete = () => {
    if (!cruise) return;

    deleteCruise.mutate(cruise.id, {
      onSuccess: () => {
        toast.success("Cruise deleted successfully");
        onOpenChange(false);
        router.push("/cruises");
      },
      onError: () => {
        toast.error("Failed to delete cruise");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Cruise
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {cruise?.name ?? "this cruise"}
            </strong>
            ? This action cannot be undone and all associated data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-sm text-red-600">
            Warning: This will permanently delete the cruise record, including
            all pricing, itinerary, cabin, and review data. This cannot be reversed.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteCruise.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCruise.isPending}
          >
            {deleteCruise.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Cruise"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
