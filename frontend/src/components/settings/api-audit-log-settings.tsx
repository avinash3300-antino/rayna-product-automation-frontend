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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { ApiAuditRecord, AuditStatus } from "@/types/settings";
import { MOCK_AUDIT_RECORDS } from "@/lib/mock-settings-data";

function getStatusBadge(status: AuditStatus) {
  switch (status) {
    case "passed":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Passed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "conditional_pass":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Conditional
        </Badge>
      );
  }
}

function getCellBadge(status: AuditStatus) {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case "conditional_pass":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
}

const EMPTY_RECORD: Omit<ApiAuditRecord, "id"> = {
  systemName: "",
  environment: "Production",
  bulkUpsert: "pending",
  idempotency: "pending",
  rollback: "pending",
  staging: "pending",
  overallStatus: "pending",
  reviewedBy: "",
  date: "",
  notes: "",
};

const AUDIT_STATUS_OPTIONS: { value: AuditStatus; label: string }[] = [
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
  { value: "conditional_pass", label: "Conditional Pass" },
];

export function ApiAuditLogTab() {
  const [records, setRecords] = useState<ApiAuditRecord[]>(MOCK_AUDIT_RECORDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] =
    useState<Omit<ApiAuditRecord, "id">>(EMPTY_RECORD);

  const allPassed = records.every((r) => r.overallStatus === "passed");
  const pendingCount = records.filter(
    (r) => r.overallStatus === "pending"
  ).length;
  const failedCount = records.filter(
    (r) => r.overallStatus === "failed"
  ).length;

  const addRecord = () => {
    setRecords((prev) => [
      ...prev,
      { ...newRecord, id: `aud-${Date.now()}` },
    ]);
    setNewRecord(EMPTY_RECORD);
    setShowAddModal(false);
  };

  const updateNewField = <K extends keyof Omit<ApiAuditRecord, "id">>(
    key: K,
    value: Omit<ApiAuditRecord, "id">[K]
  ) => {
    setNewRecord((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-base">API Audit Log</CardTitle>
              <CardDescription>
                Phase 1 gate &mdash; formal audit of Rayna&apos;s product master
                APIs before integration layer development begins.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status banner */}
      {allPassed ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-600">
            API Audit complete. All systems cleared for integration development.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm font-medium text-amber-600">
            {pendingCount > 0 && `${pendingCount} pending`}
            {pendingCount > 0 && failedCount > 0 && ", "}
            {failedCount > 0 && `${failedCount} failed`}
            {" "}audit{pendingCount + failedCount > 1 ? "s" : ""} remaining.
            Integration development blocked.
          </p>
        </div>
      )}

      {/* Audit table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Audit Records</CardTitle>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Audit Record
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System Name</TableHead>
                <TableHead>Env</TableHead>
                <TableHead className="text-center">Bulk Upsert</TableHead>
                <TableHead className="text-center">Idempotency</TableHead>
                <TableHead className="text-center">Rollback</TableHead>
                <TableHead className="text-center">Staging</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewed By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-sm">
                    {record.systemName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {record.environment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getCellBadge(record.bulkUpsert)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getCellBadge(record.idempotency)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getCellBadge(record.rollback)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getCellBadge(record.staging)}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.overallStatus)}</TableCell>
                  <TableCell className="text-sm">
                    {record.reviewedBy || "\u2014"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.date || "\u2014"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {record.notes || "\u2014"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Record Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Audit Record</DialogTitle>
            <DialogDescription>
              Record a new API audit result for the integration gate review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input
                  value={newRecord.systemName}
                  onChange={(e) =>
                    updateNewField("systemName", e.target.value)
                  }
                  placeholder="e.g. Rayna Product Master API"
                />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select
                  value={newRecord.environment}
                  onValueChange={(v) => updateNewField("environment", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Staging">Staging</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["bulkUpsert", "Bulk Upsert"],
                  ["idempotency", "Idempotency"],
                  ["rollback", "Rollback"],
                  ["staging", "Staging"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Select
                    value={newRecord[key]}
                    onValueChange={(v) =>
                      updateNewField(key, v as AuditStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIT_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Overall Status</Label>
                <Select
                  value={newRecord.overallStatus}
                  onValueChange={(v) =>
                    updateNewField("overallStatus", v as AuditStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reviewed By</Label>
                <Input
                  value={newRecord.reviewedBy}
                  onChange={(e) =>
                    updateNewField("reviewedBy", e.target.value)
                  }
                  placeholder="e.g. Ahmed K."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => updateNewField("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={newRecord.notes}
                onChange={(e) => updateNewField("notes", e.target.value)}
                placeholder="Additional notes about the audit..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={addRecord}
              disabled={!newRecord.systemName}
            >
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
