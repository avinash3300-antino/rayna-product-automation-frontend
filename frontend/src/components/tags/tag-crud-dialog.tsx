"use client";

import { useState, useEffect } from "react";
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
import { TAG_DIMENSION_LABELS } from "@/types/products";
import type { TagDimension } from "@/types/products";
import type { Tag, TagFormData } from "@/types/tags";

interface TagCrudDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TagFormData) => void;
  editingTag: Tag | null;
  parentTag: Tag | null;
  existingTags: Tag[];
}

const INITIAL_FORM: TagFormData = {
  name: "",
  code: "",
  dimension: "budget_tier",
  parentId: "",
  description: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function TagCrudDialog({
  open,
  onOpenChange,
  onSubmit,
  editingTag,
  parentTag,
  existingTags,
}: TagCrudDialogProps) {
  const [form, setForm] = useState<TagFormData>(INITIAL_FORM);
  const [autoCode, setAutoCode] = useState(true);

  useEffect(() => {
    if (editingTag) {
      setForm({
        name: editingTag.name,
        code: editingTag.code,
        dimension: editingTag.dimension,
        parentId: editingTag.parentId || "",
        description: editingTag.description,
      });
      setAutoCode(false);
    } else if (parentTag) {
      setForm({
        ...INITIAL_FORM,
        dimension: parentTag.dimension,
        parentId: parentTag.id,
      });
      setAutoCode(true);
    } else {
      setForm(INITIAL_FORM);
      setAutoCode(true);
    }
  }, [editingTag, parentTag, open]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      code: autoCode ? slugify(name) : prev.code,
    }));
  };

  const handleCodeChange = (code: string) => {
    setAutoCode(false);
    setForm((prev) => ({ ...prev, code }));
  };

  // Filter parent options to same dimension, exclude self and descendants
  const parentOptions = existingTags.filter(
    (t) =>
      t.dimension === form.dimension &&
      t.parentId === null &&
      t.id !== editingTag?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    onSubmit(form);
    onOpenChange(false);
  };

  const isEditing = !!editingTag;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tag" : "Add Tag"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the tag details below."
              : "Create a new tag by filling in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Name</Label>
            <Input
              id="tag-name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Beach & Resort"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-code">Code</Label>
            <Input
              id="tag-code"
              value={form.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="e.g. beach_resort"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Dimension</Label>
            <Select
              value={form.dimension}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, dimension: val as TagDimension, parentId: "" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TAG_DIMENSION_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Parent Tag</Label>
            <Select
              value={form.parentId || "none"}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, parentId: val === "none" ? "" : val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None (top-level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (top-level)</SelectItem>
                {parentOptions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-desc">Description</Label>
            <Input
              id="tag-desc"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of this tag"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim() || !form.code.trim()}>
              {isEditing ? "Save Changes" : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
