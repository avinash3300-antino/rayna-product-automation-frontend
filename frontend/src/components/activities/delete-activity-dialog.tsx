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
import { useDeleteActivity } from "@/hooks/api/use-activities";
import type { Activity } from "@/types/activities";

interface DeleteActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
}

export function DeleteActivityDialog({
  open,
  onOpenChange,
  activity,
}: DeleteActivityDialogProps) {
  const router = useRouter();
  const deleteActivity = useDeleteActivity();

  const handleDelete = () => {
    if (!activity) return;

    deleteActivity.mutate(activity.id, {
      onSuccess: () => {
        toast.success("Activity deleted successfully");
        onOpenChange(false);
        router.push("/activities");
      },
      onError: () => {
        toast.error("Failed to delete activity");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Activity
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {activity?.name ?? "this activity"}
            </strong>
            ? This action cannot be undone and all associated data will be
            permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-sm text-red-600">
            Warning: This will permanently delete the activity record, including
            all pricing, media, and review data. This cannot be reversed.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteActivity.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteActivity.isPending}
          >
            {deleteActivity.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Activity"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
