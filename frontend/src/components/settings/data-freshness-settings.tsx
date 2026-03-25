"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Clock, Pencil, Check, X, Save } from "lucide-react";
import type { FreshnessRule, StaleAction } from "@/types/settings";
import {
  MOCK_FRESHNESS_RULES,
  STALE_ACTION_OPTIONS,
} from "@/lib/mock-settings-data";

function hoursToReadable(hours: number): string {
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""}`;
}

function getActionLabel(action: StaleAction): string {
  return (
    STALE_ACTION_OPTIONS.find((o) => o.value === action)?.label ?? action
  );
}

function getActionColor(action: StaleAction): string {
  switch (action) {
    case "flag_refresh":
      return "bg-blue-500/15 text-blue-600 border-blue-500/25";
    case "flag_human_review":
      return "bg-amber-500/15 text-amber-600 border-amber-500/25";
    case "auto_refresh_ai":
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/25";
    case "flag_manual_review":
      return "bg-orange-500/15 text-orange-600 border-orange-500/25";
    case "flag_manual_verification":
      return "bg-purple-500/15 text-purple-600 border-purple-500/25";
    default:
      return "";
  }
}

export function DataFreshnessTab() {
  const [rules, setRules] = useState<FreshnessRule[]>(MOCK_FRESHNESS_RULES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<FreshnessRule>>({});

  const startEdit = (rule: FreshnessRule) => {
    setEditingId(rule.id);
    setEditDraft({
      thresholdHours: rule.thresholdHours,
      staleAction: rule.staleAction,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              thresholdHours: editDraft.thresholdHours ?? r.thresholdHours,
              humanReadable: hoursToReadable(
                editDraft.thresholdHours ?? r.thresholdHours
              ),
              staleAction: (editDraft.staleAction as StaleAction) ?? r.staleAction,
            }
          : r
      )
    );
    setEditingId(null);
    setEditDraft({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Data Freshness Rules</CardTitle>
              <CardDescription>
                Configure staleness thresholds per data type. When a threshold
                is exceeded, the configured action is triggered.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Type</TableHead>
                <TableHead>Threshold (hours)</TableHead>
                <TableHead>Human-Readable</TableHead>
                <TableHead>Stale Action</TableHead>
                <TableHead className="w-[100px]">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium font-mono text-sm">
                    {rule.dataType}
                  </TableCell>
                  <TableCell>
                    {editingId === rule.id ? (
                      <Input
                        type="number"
                        min={1}
                        className="w-24 h-8"
                        value={editDraft.thresholdHours ?? rule.thresholdHours}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            thresholdHours: Number(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <span>{rule.thresholdHours}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {editingId === rule.id
                      ? hoursToReadable(
                          editDraft.thresholdHours ?? rule.thresholdHours
                        )
                      : rule.humanReadable}
                  </TableCell>
                  <TableCell>
                    {editingId === rule.id ? (
                      <Select
                        value={editDraft.staleAction ?? rule.staleAction}
                        onValueChange={(v) =>
                          setEditDraft((d) => ({
                            ...d,
                            staleAction: v as StaleAction,
                          }))
                        }
                      >
                        <SelectTrigger className="w-[200px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STALE_ACTION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className={getActionColor(rule.staleAction)}
                      >
                        {getActionLabel(rule.staleAction)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === rule.id ? (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => saveEdit(rule.id)}
                        >
                          <Check className="h-4 w-4 text-emerald-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => startEdit(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Freshness Rules
        </Button>
      </div>
    </div>
  );
}
