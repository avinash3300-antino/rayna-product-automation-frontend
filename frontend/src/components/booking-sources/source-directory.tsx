"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Wifi,
  Map,
  Star,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BookingSource, BookingMode } from "@/types/booking-sources";
import type { ProductCategory } from "@/types/destinations";
import {
  BOOKING_MODE_CONFIG,
  HEALTH_STATUS_CONFIG,
  CATEGORY_LABELS,
} from "@/types/booking-sources";
import {
  MOCK_BOOKING_SOURCES,
  MOCK_INGESTION_SOURCES,
} from "@/lib/mock-booking-sources";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function StarRating({ score }: { score: number }) {
  const stars = Math.round((score / 10) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < stars
              ? "fill-gold text-gold"
              : "fill-none text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{score}/10</span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface SourceFormData {
  name: string;
  code: string;
  category: ProductCategory;
  mode: BookingMode;
  endpointUrl: string;
  contactEmail: string;
  contactPhone: string;
  marginPriorityScore: number;
  isActive: boolean;
  ingestionSourceId: string;
}

const INITIAL_FORM: SourceFormData = {
  name: "",
  code: "",
  category: "hotels",
  mode: "api",
  endpointUrl: "",
  contactEmail: "",
  contactPhone: "",
  marginPriorityScore: 5,
  isActive: true,
  ingestionSourceId: "",
};

export function SourceDirectory() {
  const [sources, setSources] = useState<BookingSource[]>(MOCK_BOOKING_SOURCES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SourceFormData>(INITIAL_FORM);

  const handleOpenAdd = useCallback(() => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback(
    (source: BookingSource) => {
      setEditingId(source.id);
      setForm({
        name: source.name,
        code: source.code,
        category: source.category,
        mode: source.mode,
        endpointUrl: source.endpointUrl || "",
        contactEmail: source.contactEmail || "",
        contactPhone: source.contactPhone || "",
        marginPriorityScore: source.marginPriorityScore,
        isActive: source.isActive,
        ingestionSourceId: source.ingestionSourceId || "",
      });
      setDialogOpen(true);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!form.name || !form.code || !form.category || !form.mode) return;
    const now = new Date().toISOString();
    if (editingId) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: form.name,
                code: form.code,
                category: form.category,
                mode: form.mode,
                endpointUrl: form.mode === "api" ? form.endpointUrl || null : null,
                contactEmail:
                  form.mode !== "api" ? form.contactEmail || null : null,
                contactPhone: form.contactPhone || null,
                marginPriorityScore: form.marginPriorityScore,
                isActive: form.isActive,
                ingestionSourceId: form.ingestionSourceId || null,
                updatedAt: now,
              }
            : s
        )
      );
    } else {
      const newSource: BookingSource = {
        id: `src-${Date.now()}`,
        name: form.name,
        code: form.code,
        category: form.category,
        mode: form.mode,
        endpointUrl: form.mode === "api" ? form.endpointUrl || null : null,
        contactEmail:
          form.mode !== "api" ? form.contactEmail || null : null,
        contactPhone: form.contactPhone || null,
        marginPriorityScore: form.marginPriorityScore,
        isActive: form.isActive,
        ingestionSourceId: form.ingestionSourceId || null,
        healthStatus: "online",
        lastPingTime: now,
        responseTimeMs: 0,
        createdAt: now,
        updatedAt: now,
      };
      setSources((prev) => [...prev, newSource]);
    }
    setDialogOpen(false);
  }, [editingId, form]);

  const handleToggleActive = useCallback((id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  }, []);

  const handleTestConnection = useCallback((source: BookingSource) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === source.id
          ? { ...s, lastPingTime: new Date().toISOString() }
          : s
      )
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sources.length} sources configured &middot;{" "}
          {sources.filter((s) => s.isActive).length} active
        </p>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Source
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Endpoint / Contact</TableHead>
              <TableHead>Margin Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => {
              const modeConfig = BOOKING_MODE_CONFIG[source.mode];
              const healthConfig = HEALTH_STATUS_CONFIG[source.healthStatus];
              return (
                <TableRow key={source.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{source.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${modeConfig.color}`}
                      >
                        {modeConfig.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {CATEGORY_LABELS[source.category]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {source.mode === "api" && source.endpointUrl ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[200px] truncate">
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{source.endpointUrl}</span>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {source.contactEmail && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {source.contactEmail}
                          </div>
                        )}
                        {source.contactPhone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {source.contactPhone}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StarRating score={source.marginPriorityScore} />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={source.isActive}
                      onCheckedChange={() => handleToggleActive(source.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${healthConfig.dotColor}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(source.lastPingTime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(source)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {source.mode === "api" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestConnection(source)}
                        >
                          <Wifi className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Map className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Source Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Source" : "Add New Source"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      code: editingId ? f.code : slugify(name),
                    }));
                  }}
                  placeholder="e.g. Viator API"
                />
              </div>
              <div className="space-y-2">
                <Label>Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value }))
                  }
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as ProductCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="transfers">Transfers</SelectItem>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Booking Mode *</Label>
                <Select
                  value={form.mode}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, mode: v as BookingMode }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.mode === "api" && (
              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <Input
                  value={form.endpointUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endpointUrl: e.target.value }))
                  }
                  placeholder="https://api.example.com/v1"
                />
              </div>
            )}

            {form.mode !== "api" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactEmail: e.target.value }))
                    }
                    placeholder="bookings@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, contactPhone: e.target.value }))
                    }
                    placeholder="+971-4-555-0000"
                  />
                </div>
              </div>
            )}

            {form.mode === "api" && (
              <div className="space-y-2">
                <Label>Contact Phone (optional)</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactPhone: e.target.value }))
                  }
                  placeholder="+971-4-555-0000"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Margin Priority Score: {form.marginPriorityScore}/10
              </Label>
              <Slider
                value={[form.marginPriorityScore]}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, marginPriorityScore: v[0] }))
                }
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isActive: v }))
                }
              />
              <Label>Is Active</Label>
            </div>

            <div className="space-y-2">
              <Label>Link to Ingestion Source (optional)</Label>
              <Select
                value={form.ingestionSourceId || "none"}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    ingestionSourceId: v === "none" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingestion source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {MOCK_INGESTION_SOURCES.map((src) => (
                    <SelectItem key={src.id} value={src.id}>
                      {src.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Save Changes" : "Create Source"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
