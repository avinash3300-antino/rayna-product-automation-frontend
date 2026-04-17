"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  DollarSign,
  Settings2,
  Code2,
  History,
  Save,
} from "lucide-react";
import type { PackageType, PackageRules, PackagePricingDefaults } from "@/types/settings";
import {
  MOCK_PACKAGE_TYPES,
  MOCK_PACKAGE_PRICING,
  CURRENCY_OPTIONS,
} from "@/lib/mock-settings-data";

const RULE_FIELDS: {
  key: keyof PackageRules;
  label: string;
  type: "number" | "boolean";
}[] = [
  { key: "min_hotels", label: "Min Hotels", type: "number" },
  { key: "max_hotels", label: "Max Hotels", type: "number" },
  { key: "min_attractions", label: "Min Attractions", type: "number" },
  { key: "max_attractions", label: "Max Attractions", type: "number" },
  { key: "min_transfers", label: "Min Transfers", type: "number" },
  {
    key: "requires_booking_source",
    label: "Requires Booking Source",
    type: "boolean",
  },
  { key: "requires_tag_match", label: "Requires Tag Match", type: "boolean" },
];

export function PackageRulesTab() {
  const [packageTypes, setPackageTypes] =
    useState<PackageType[]>(MOCK_PACKAGE_TYPES);
  const [pricing, setPricing] =
    useState<PackagePricingDefaults>(MOCK_PACKAGE_PRICING);
  const [editingPkg, setEditingPkg] = useState<PackageType | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [draftRules, setDraftRules] = useState<PackageRules | null>(null);

  const openRuleEditor = (pkg: PackageType) => {
    setEditingPkg(pkg);
    setDraftRules({ ...pkg.rules });
    setRawJson(JSON.stringify(pkg.rules, null, 2));
    setShowRawJson(false);
    setJsonError("");
    setSelectedVersion("");
  };

  const handleRuleChange = (key: keyof PackageRules, value: number | boolean) => {
    if (!draftRules) return;
    const updated = { ...draftRules, [key]: value };
    setDraftRules(updated);
    setRawJson(JSON.stringify(updated, null, 2));
  };

  const handleJsonChange = (json: string) => {
    setRawJson(json);
    try {
      const parsed = JSON.parse(json);
      setDraftRules(parsed);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON");
      toast.error("Invalid JSON format.");
    }
  };

  const handleVersionChange = (version: string) => {
    if (!editingPkg) return;
    setSelectedVersion(version);
    const v = editingPkg.ruleVersions.find(
      (rv) => rv.version.toString() === version
    );
    if (v) {
      setDraftRules({ ...v.rules });
      setRawJson(JSON.stringify(v.rules, null, 2));
    }
  };

  const saveRules = () => {
    if (!editingPkg || !draftRules) return;
    setPackageTypes((prev) =>
      prev.map((pt) =>
        pt.id === editingPkg.id
          ? {
              ...pt,
              rules: draftRules,
              ruleVersions: [
                ...pt.ruleVersions,
                {
                  version: pt.ruleVersions.length + 1,
                  savedAt: new Date().toISOString(),
                  savedBy: "admin@rayna.com",
                  rules: draftRules,
                },
              ],
            }
          : pt
      )
    );
    setEditingPkg(null);
  };

  const toggleActive = (id: string) => {
    setPackageTypes((prev) =>
      prev.map((pt) => (pt.id === id ? { ...pt, active: !pt.active } : pt))
    );
  };

  return (
    <div className="space-y-6">
      {/* Package Types Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Package className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <CardTitle className="text-base">Package Types</CardTitle>
              <CardDescription>
                Configure package types, margins, and validation rules
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Default Margin %</TableHead>
                <TableHead>Min Nights</TableHead>
                <TableHead>Max Nights</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Rules</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packageTypes.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.typeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {pkg.code}
                    </Badge>
                  </TableCell>
                  <TableCell>{pkg.defaultMarginPercent}%</TableCell>
                  <TableCell>{pkg.minNights}</TableCell>
                  <TableCell>{pkg.maxNights}</TableCell>
                  <TableCell>
                    <Switch
                      checked={pkg.active}
                      onCheckedChange={() => toggleActive(pkg.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => openRuleEditor(pkg)}
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                      Edit Rules
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Package Pricing Defaults */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-base">
                Package Pricing Defaults
              </CardTitle>
              <CardDescription>
                Global pricing parameters for all package types
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="defaultMargin">Default Margin %</Label>
              <Input
                id="defaultMargin"
                type="number"
                min={0}
                max={100}
                value={pricing.defaultMarginPercent}
                onChange={(e) =>
                  setPricing((p) => ({
                    ...p,
                    defaultMarginPercent: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorMargin">Floor Margin %</Label>
              <Input
                id="floorMargin"
                type="number"
                min={0}
                max={100}
                value={pricing.floorMarginPercent}
                onChange={(e) =>
                  setPricing((p) => ({
                    ...p,
                    floorMarginPercent: Number(e.target.value),
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum acceptable margin
              </p>
            </div>
            <div className="space-y-2">
              <Label>Currency Code for Display Prices</Label>
              <Select
                value={pricing.currencyCode}
                onValueChange={(v) =>
                  setPricing((p) => ({ ...p, currencyCode: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Package Settings
        </Button>
      </div>

      {/* Rule Editor Dialog */}
      <Dialog
        open={!!editingPkg}
        onOpenChange={(open) => !open && setEditingPkg(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Edit Rules: {editingPkg?.typeName}
            </DialogTitle>
            <DialogDescription>
              Configure validation rules for this package type. Changes are saved
              as a new version.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Version history + mode toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedVersion}
                  onValueChange={handleVersionChange}
                >
                  <SelectTrigger className="w-[200px] h-8">
                    <SelectValue placeholder="Version history" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingPkg?.ruleVersions.map((v) => (
                      <SelectItem
                        key={v.version}
                        value={v.version.toString()}
                      >
                        v{v.version} &mdash;{" "}
                        {new Date(v.savedAt).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowRawJson(!showRawJson)}
              >
                <Code2 className="h-3.5 w-3.5" />
                {showRawJson ? "Visual Editor" : "Raw JSON"}
              </Button>
            </div>

            {/* Visual editor */}
            {!showRawJson && draftRules && (
              <div className="grid gap-3 sm:grid-cols-2">
                {RULE_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <Label className="text-sm">{field.label}</Label>
                    {field.type === "number" ? (
                      <Input
                        type="number"
                        min={0}
                        className="w-20 h-8 text-right"
                        value={draftRules[field.key] as number}
                        onChange={(e) =>
                          handleRuleChange(field.key, Number(e.target.value))
                        }
                      />
                    ) : (
                      <Switch
                        checked={draftRules[field.key] as boolean}
                        onCheckedChange={(v) =>
                          handleRuleChange(field.key, v)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Raw JSON editor */}
            {showRawJson && (
              <div className="space-y-2">
                <Textarea
                  className="font-mono text-sm min-h-[250px]"
                  value={rawJson}
                  onChange={(e) => handleJsonChange(e.target.value)}
                />
                {jsonError && (
                  <p className="text-sm text-red-500">{jsonError}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPkg(null)}>
              Cancel
            </Button>
            <Button className="gap-2" onClick={saveRules} disabled={!!jsonError}>
              <Save className="h-4 w-4" />
              Save as New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
