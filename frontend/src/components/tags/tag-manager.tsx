"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Tag, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { TagDimension } from "@/types/products";
import type { Tag as TagType, TagFormData, AiTagSuggestion } from "@/types/tags";
import { MOCK_TAGS, MOCK_AI_SUGGESTIONS, buildTagTree } from "@/lib/mock-tags-data";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { TagDimensionsPanel } from "./tag-dimensions-panel";
import { BulkTagProducts } from "./bulk-tag-products";
import { AiSuggestionsQueue } from "./ai-suggestions-queue";
import { TagCrudDialog } from "./tag-crud-dialog";

export function TagManager() {
  // Core state
  const [tags, setTags] = useState<TagType[]>(MOCK_TAGS);
  const [suggestions, setSuggestions] = useState<AiTagSuggestion[]>(MOCK_AI_SUGGESTIONS);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [parentTag, setParentTag] = useState<TagType | null>(null);

  // Mobile sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // Build tree from flat tags
  const tagTree = useMemo(() => buildTagTree(tags), [tags]);

  // ---- Tag CRUD ----
  const handleAddTag = useCallback((dimension: TagDimension) => {
    setEditingTag(null);
    setParentTag(null);
    setDialogOpen(true);
    // Pre-select dimension by creating a temporary "parent" marker
    setParentTag({ dimension } as TagType);
  }, []);

  const handleEditTag = useCallback((tag: TagType) => {
    setEditingTag(tag);
    setParentTag(null);
    setDialogOpen(true);
  }, []);

  const handleAddChild = useCallback((parent: TagType) => {
    setEditingTag(null);
    setParentTag(parent);
    setDialogOpen(true);
  }, []);

  const handleDeleteTag = useCallback((tagId: string) => {
    setTags((prev) => {
      // Remove tag and its children
      const toRemove = new Set<string>();
      const collect = (id: string) => {
        toRemove.add(id);
        prev.filter((t) => t.parentId === id).forEach((t) => collect(t.id));
      };
      collect(tagId);
      return prev.filter((t) => !toRemove.has(t.id));
    });
  }, []);

  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      if (editingTag) {
        // Update
        setTags((prev) =>
          prev.map((t) =>
            t.id === editingTag.id
              ? { ...t, name: data.name, code: data.code, dimension: data.dimension, parentId: data.parentId || null, description: data.description }
              : t
          )
        );
      } else {
        // Create
        const newTag: TagType = {
          id: `tag-new-${Date.now()}`,
          name: data.name,
          code: data.code,
          dimension: data.dimension,
          parentId: data.parentId || null,
          description: data.description,
          productCount: 0,
        };
        setTags((prev) => [...prev, newTag]);
      }
    },
    [editingTag]
  );

  // ---- Bulk Tagging ----
  const handleApplyTags = useCallback(
    (productIds: string[], tagIds: string[]) => {
      // In a real app this would call an API. For mock, just log.
      const tagNames = tagIds
        .map((id) => tags.find((t) => t.id === id)?.name)
        .filter(Boolean);
      console.log(
        `Applied tags [${tagNames.join(", ")}] to ${productIds.length} products`
      );
    },
    [tags]
  );

  // ---- AI Suggestions ----
  const handleAcceptSuggestion = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "accepted" as const } : s))
    );
  }, []);

  const handleRejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "rejected" as const } : s))
    );
  }, []);

  const handleBulkAccept = useCallback((ids: string[]) => {
    setSuggestions((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, status: "accepted" as const } : s))
    );
  }, []);

  const handleBulkReject = useCallback((ids: string[]) => {
    setSuggestions((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, status: "rejected" as const } : s))
    );
  }, []);

  const handleOpenNewTag = () => {
    setEditingTag(null);
    setParentTag(null);
    setDialogOpen(true);
  };

  const dimensionsPanel = (
    <TagDimensionsPanel
      tagTree={tagTree}
      onAddTag={handleAddTag}
      onEditTag={handleEditTag}
      onDeleteTag={handleDeleteTag}
      onAddChild={handleAddChild}
    />
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tag Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage tag dimensions, bulk-tag products, and review AI suggestions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile panel trigger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <PanelLeft className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle>Tag Dimensions</SheetTitle>
              </SheetHeader>
              {dimensionsPanel}
            </SheetContent>
          </Sheet>

          <Button onClick={handleOpenNewTag}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left Panel - Tag Tree (desktop only) */}
        <Card className="hidden lg:block w-80 shrink-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Tag Dimensions</h3>
          </div>
          <div className="h-[calc(100vh-260px)]">{dimensionsPanel}</div>
        </Card>

        {/* Right Panel */}
        <div className="flex-1 min-w-0 space-y-6">
          <BulkTagProducts
            products={MOCK_PRODUCTS}
            tags={tags}
            onApplyTags={handleApplyTags}
          />

          <AiSuggestionsQueue
            suggestions={suggestions}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
            onBulkAccept={handleBulkAccept}
            onBulkReject={handleBulkReject}
          />
        </div>
      </div>

      {/* Tag CRUD Dialog */}
      <TagCrudDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitTag}
        editingTag={editingTag}
        parentTag={parentTag}
        existingTags={tags}
      />
    </div>
  );
}
