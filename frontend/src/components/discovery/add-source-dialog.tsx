"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddManualSource } from "@/hooks/api/use-discovery";
import { toast } from "sonner";

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runId: string;
}

interface FormData {
  sourceName: string;
  sourceUrl: string;
  tier: string;
}

const INITIAL_FORM: FormData = {
  sourceName: "",
  sourceUrl: "",
  tier: "",
};

export function AddSourceDialog({
  open,
  onOpenChange,
  runId,
}: AddSourceDialogProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const addManualSource = useAddManualSource();

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.sourceName.trim() || !form.sourceUrl.trim() || !form.tier) {
      toast.error("Please fill in all fields.");
      return;
    }

    addManualSource.mutate(
      {
        runId,
        source_name: form.sourceName.trim(),
        source_url: form.sourceUrl.trim(),
        tier: parseInt(form.tier, 10),
      },
      {
        onSuccess: (source) => {
          toast.success(
            `Source "${source.sourceName}" added successfully.`
          );
          setForm(INITIAL_FORM);
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to add source"
          );
        },
      }
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setForm(INITIAL_FORM);
    }
    onOpenChange(nextOpen);
  }

  const isFormValid =
    form.sourceName.trim() && form.sourceUrl.trim() && form.tier;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Source</DialogTitle>
          <DialogDescription>
            Manually add a source URL to this discovery run.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-name">Source Name</Label>
            <Input
              id="source-name"
              placeholder="e.g., TripAdvisor Dubai Adventures"
              value={form.sourceName}
              onChange={(e) => handleChange("sourceName", e.target.value)}
              disabled={addManualSource.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-url">Source URL</Label>
            <Input
              id="source-url"
              type="url"
              placeholder="https://example.com/..."
              value={form.sourceUrl}
              onChange={(e) => handleChange("sourceUrl", e.target.value)}
              disabled={addManualSource.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-tier">Tier</Label>
            <Select
              value={form.tier}
              onValueChange={(v) => handleChange("tier", v)}
              disabled={addManualSource.isPending}
            >
              <SelectTrigger id="source-tier">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Tier 1 - Primary</SelectItem>
                <SelectItem value="2">Tier 2 - Secondary</SelectItem>
                <SelectItem value="3">Tier 3 - Supplementary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={addManualSource.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || addManualSource.isPending}
            >
              {addManualSource.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
