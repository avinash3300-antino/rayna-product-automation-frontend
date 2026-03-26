"use client";

import { useState } from "react";
import { BellRing, Monitor, Sun, Moon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { NotificationPreference, UIPreferences } from "@/types/profile";
import {
  DATE_FORMAT_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
} from "@/lib/mock-profile-data";

interface PreferencesTabProps {
  initialNotifPrefs: NotificationPreference[];
  initialUiPrefs: UIPreferences;
  onDirty: () => void;
}

const THEME_OPTIONS: {
  value: UIPreferences["theme"];
  label: string;
  icon: typeof Sun;
  description: string;
}[] = [
  { value: "light", label: "Light", icon: Sun, description: "Always use light theme" },
  { value: "dark", label: "Dark", icon: Moon, description: "Always use dark theme" },
  { value: "system", label: "System", icon: Monitor, description: "Match system setting" },
];

export function PreferencesTab({
  initialNotifPrefs,
  initialUiPrefs,
  onDirty,
}: PreferencesTabProps) {
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreference[]>(initialNotifPrefs);
  const [uiPrefs, setUiPrefs] = useState<UIPreferences>(initialUiPrefs);

  function toggleNotif(id: string, field: "inApp" | "email") {
    setNotifPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
    onDirty();
  }

  function updateUi(patch: Partial<UIPreferences>) {
    setUiPrefs((prev) => ({ ...prev, ...patch }));
    onDirty();
  }

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
              <BellRing className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you receive and how
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Event</TableHead>
                <TableHead className="text-center">In-App</TableHead>
                <TableHead className="text-center">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifPrefs.map((pref) => (
                <TableRow key={pref.id}>
                  <TableCell className="text-sm">{pref.event}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pref.inApp}
                      onCheckedChange={() => toggleNotif(pref.id, "inApp")}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pref.email}
                      onCheckedChange={() => toggleNotif(pref.id, "email")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* UI Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <Monitor className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-base">UI Preferences</CardTitle>
              <CardDescription>
                Customize how the application looks and behaves for you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sidebar Default */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Sidebar default collapsed</Label>
              <p className="text-xs text-muted-foreground">
                Start with the sidebar collapsed on each login
              </p>
            </div>
            <Switch
              checked={uiPrefs.sidebarDefaultCollapsed}
              onCheckedChange={(v) => updateUi({ sidebarDefaultCollapsed: v })}
            />
          </div>

          {/* Product View */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Default product view</Label>
              <p className="text-xs text-muted-foreground">
                How products display in the browser by default
              </p>
            </div>
            <Select
              value={uiPrefs.productViewMode}
              onValueChange={(v) =>
                updateUi({ productViewMode: v as UIPreferences["productViewMode"] })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Format */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Date format</Label>
              <p className="text-xs text-muted-foreground">
                How dates are displayed across the app
              </p>
            </div>
            <Select
              value={uiPrefs.dateFormat}
              onValueChange={(v) =>
                updateUi({ dateFormat: v as UIPreferences["dateFormat"] })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Items per page</Label>
              <p className="text-xs text-muted-foreground">
                Default page size for lists and tables
              </p>
            </div>
            <Select
              value={String(uiPrefs.itemsPerPage)}
              onValueChange={(v) => updateUi({ itemsPerPage: Number(v) })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <div>
              <Label>Theme</Label>
              <p className="text-xs text-muted-foreground">
                Select your preferred color scheme
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => updateUi({ theme: opt.value })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                      uiPrefs.theme === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:border-border"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground text-center">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
