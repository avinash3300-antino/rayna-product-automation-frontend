"use client";

import { useState, useMemo } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Shield,
  Check,
  X,
  Smartphone,
  Laptop,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useChangePassword } from "@/hooks/api";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ActiveSession, ChangePasswordForm, PasswordStrength } from "@/types/profile";
import { formatRelativeTime } from "@/lib/format";

function calcPasswordStrength(pw: string): {
  strength: PasswordStrength;
  score: number;
  label: string;
  color: string;
} {
  let points = 0;
  if (pw.length >= 8) points++;
  if (/[A-Z]/.test(pw)) points++;
  if (/[a-z]/.test(pw)) points++;
  if (/[0-9]/.test(pw)) points++;
  if (/[^A-Za-z0-9]/.test(pw)) points++;

  if (points <= 1) return { strength: "weak", score: 20, label: "Weak", color: "bg-red-500" };
  if (points <= 2) return { strength: "fair", score: 40, label: "Fair", color: "bg-amber-500" };
  if (points <= 3) return { strength: "strong", score: 70, label: "Strong", color: "bg-emerald-500" };
  return { strength: "very-strong", score: 100, label: "Very Strong", color: "bg-green-500" };
}

function getDeviceIcon(device: string) {
  const lower = device.toLowerCase();
  if (lower.includes("iphone") || lower.includes("android") || lower.includes("phone")) {
    return <Smartphone className="h-4 w-4 text-muted-foreground" />;
  }
  if (lower.includes("mac") || lower.includes("laptop")) {
    return <Laptop className="h-4 w-4 text-muted-foreground" />;
  }
  return <Monitor className="h-4 w-4 text-muted-foreground" />;
}

interface SecurityTabProps {
  initialSessions: ActiveSession[];
  onDirty: () => void;
}

export function SecurityTab({ initialSessions, onDirty }: SecurityTabProps) {
  const [form, setForm] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const changePasswordMutation = useChangePassword();

  const pw = form.newPassword;
  const strength = useMemo(() => calcPasswordStrength(pw), [pw]);

  const rules = [
    { label: "At least 8 characters", pass: pw.length >= 8 },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "Contains lowercase letter", pass: /[a-z]/.test(pw) },
    { label: "Contains number", pass: /[0-9]/.test(pw) },
    { label: "Contains special character", pass: /[^A-Za-z0-9]/.test(pw) },
  ];

  const allRulesPass = rules.every((r) => r.pass);
  const passwordsMatch = pw === form.confirmPassword && form.confirmPassword.length > 0;
  const canUpdatePassword =
    form.currentPassword.length > 0 && allRulesPass && passwordsMatch;

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function revokeAllOther() {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Lock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Current Password */}
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, currentPassword: e.target.value }));
                    onDirty();
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, newPassword: e.target.value }));
                    onDirty();
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {pw.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className="text-xs font-medium">{strength.label}</span>
                  </div>
                  <Progress value={strength.score} className="h-1.5" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }));
                    onDirty();
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Validation Rules */}
          {pw.length > 0 && (
            <div className="grid gap-1 sm:grid-cols-2 pt-2">
              {rules.map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center gap-1.5 text-xs"
                >
                  {rule.pass ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={rule.pass ? "text-emerald-600" : "text-muted-foreground"}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {changePasswordMutation.error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {changePasswordMutation.error.message || "Failed to update password."}
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              Password updated successfully.
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              disabled={!canUpdatePassword || changePasswordMutation.isPending}
              size="sm"
              onClick={() => {
                changePasswordMutation.mutate(
                  {
                    current_password: form.currentPassword,
                    new_password: form.newPassword,
                    confirm_password: form.confirmPassword,
                  },
                  {
                    onSuccess: () => {
                      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setPasswordSuccess(true);
                      setTimeout(() => setPasswordSuccess(false), 3000);
                    },
                  }
                );
              }}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Globe className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions across devices
                </CardDescription>
              </div>
            </div>
            {sessions.filter((s) => !s.isCurrent).length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={revokeAllOther}
              >
                Sign out all other devices
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead className="hidden sm:table-cell">IP Address</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.device)}
                      <span className="text-sm">{session.device}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{session.browser}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm font-mono text-muted-foreground">
                    {session.ip}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {session.location}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeTime(session.lastActive)}
                  </TableCell>
                  <TableCell className="text-right">
                    {session.isCurrent ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 text-[10px]"
                      >
                        This device
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-7 text-xs"
                        onClick={() => revokeSession(session.id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication (Placeholder) */}
      <TooltipProvider>
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
                  <Badge variant="outline" className="text-[10px]">
                    Coming Soon
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a verification
                  code in addition to your password.
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button disabled size="sm">
                      Enable 2FA
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Coming soon — not yet available</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
