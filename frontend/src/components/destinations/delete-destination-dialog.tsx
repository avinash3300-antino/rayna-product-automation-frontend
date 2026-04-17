"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert } from "lucide-react";
import type { Destination } from "@/types/destinations";

interface DeleteDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null;
  onConfirm: (destinationId: string) => void;
  isPending?: boolean;
}

export function DeleteDestinationDialog({
  open,
  onOpenChange,
  destination,
  onConfirm,
  isPending,
}: DeleteDestinationDialogProps) {
  if (!destination) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Destination</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            {destination.countryFlag} {destination.name}
          </span>
          ? All associated locations will also be removed.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(destination.id)}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
