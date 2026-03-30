"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Ban,
  UserX,
  KeyRound,
  Users,
  UserCheck,
  Clock,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AppUser,
  UserRole,
  UserStatus,
  InviteFormData,
} from "@/types/users";
import {
  USER_ROLE_CONFIG,
  USER_STATUS_CONFIG,
  ROLES_REFERENCE,
} from "@/types/users";
import {
  useUsers,
  useInviteUser,
  useUpdateUser,
  useResetUserPassword,
} from "@/hooks/api";

const ALL_ROLES: UserRole[] = [
  "admin",
  "product_manager",
  "content_reviewer",
  "classification_reviewer",
  "read_only",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteFormData>({
    fullName: "",
    email: "",
    roles: [],
  });

  // Edit drawer state
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("active");
  const [editRoles, setEditRoles] = useState<UserRole[]>([]);

  // API hooks
  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({ search: search || undefined, page, perPage: 25 });
  const users = usersData?.data ?? [];

  const inviteMutation = useInviteUser();
  const updateMutation = useUpdateUser();
  const resetPasswordMutation = useResetUserPassword();

  // Show toast on query error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load users. Please try again.");
    }
  }, [error]);

  // Stats derived from current data
  const stats = useMemo(() => {
    const total = usersData?.total ?? 0;
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.lastLogin === null).length;
    const distinctRoles = new Set(users.flatMap((u) => u.roles)).size;
    return { total, active, pending, distinctRoles };
  }, [users, usersData?.total]);

  // Invite handlers
  const handleInviteRoleToggle = useCallback((role: UserRole) => {
    setInviteForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }, []);

  const handleSendInvite = useCallback(() => {
    if (!inviteForm.fullName || !inviteForm.email || inviteForm.roles.length === 0) return;
    inviteMutation.mutate(
      {
        full_name: inviteForm.fullName,
        email: inviteForm.email,
        roles: inviteForm.roles,
      },
      {
        onSuccess: () => {
          setInviteForm({ fullName: "", email: "", roles: [] });
          setInviteOpen(false);
          toast.success("Invitation sent successfully.");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to send invitation.");
        },
      }
    );
  }, [inviteForm, inviteMutation]);

  // Edit handlers
  const handleOpenEdit = useCallback((user: AppUser) => {
    setEditUser(user);
    setEditName(user.fullName);
    setEditStatus(user.status);
    setEditRoles([...user.roles]);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editUser) return;
    updateMutation.mutate(
      {
        userId: editUser.id,
        data: {
          full_name: editName,
          status: editStatus,
          roles: editRoles,
        },
      },
      {
        onSuccess: () => {
          setEditUser(null);
          toast.success("User updated successfully.");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update user.");
        },
      }
    );
  }, [editUser, editName, editStatus, editRoles, updateMutation]);

  const handleSuspend = useCallback(
    (userId: string) => {
      updateMutation.mutate(
        { userId, data: { status: "suspended" } },
        {
          onSuccess: () => toast.success("User suspended."),
          onError: (err) => toast.error(err.message || "Failed to suspend user."),
        }
      );
    },
    [updateMutation]
  );

  const handleDeactivate = useCallback(
    (userId: string) => {
      updateMutation.mutate(
        { userId, data: { status: "inactive" } },
        {
          onSuccess: () => toast.success("User deactivated."),
          onError: (err) => toast.error(err.message || "Failed to deactivate user."),
        }
      );
    },
    [updateMutation]
  );

  const handleResetPassword = useCallback(
    (userId: string) => {
      resetPasswordMutation.mutate(userId, {
        onSuccess: () => toast.success("Password reset email sent."),
        onError: (err) => toast.error(err.message || "Failed to reset password."),
      });
    },
    [resetPasswordMutation]
  );

  const handleAddEditRole = useCallback((role: UserRole) => {
    setEditRoles((prev) =>
      prev.includes(role) ? prev : [...prev, role]
    );
  }, []);

  const handleRemoveEditRole = useCallback((role: UserRole) => {
    setEditRoles((prev) => prev.filter((r) => r !== role));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <UserCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Mail className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">
                Pending Invitations
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Shield className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.distinctRoles}</p>
              <p className="text-xs text-muted-foreground">Roles in Use</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const statusConfig = USER_STATUS_CONFIG[user.status];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-navy text-white text-xs">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => {
                          const rc = USER_ROLE_CONFIG[role];
                          if (!rc) return null;
                          return (
                            <Badge
                              key={role}
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${rc.color}`}
                            >
                              {rc.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {statusConfig && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(user.lastLogin)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(user)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {user.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspend(user.id)}
                            title="Suspend"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {user.status !== "inactive" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(user.id)}
                            title="Deactivate"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Reset Password"
                          onClick={() => handleResetPassword(user.id)}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {usersData.page} of {usersData.totalPages} ({usersData.total}{" "}
              total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= usersData.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Roles Reference Table (Collapsible) */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setRolesExpanded(!rolesExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Roles Reference</span>
          </div>
          {rolesExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {rolesExpanded && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Screens Accessible</TableHead>
                <TableHead>Write Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLES_REFERENCE.map((ref) => {
                const rc = USER_ROLE_CONFIG[ref.role];
                return (
                  <TableRow key={ref.role}>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${rc.color}`}
                      >
                        {rc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{ref.accessLevel}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                      {ref.screens}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[250px]">
                      {ref.writePermissions}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Invite User Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={inviteForm.fullName}
                onChange={(e) =>
                  setInviteForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="e.g. John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="john@raynatours.com"
              />
            </div>
            <div className="space-y-3">
              <Label>Assign Role(s) *</Label>
              {ALL_ROLES.map((role) => {
                const rc = USER_ROLE_CONFIG[role];
                return (
                  <label
                    key={role}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={inviteForm.roles.includes(role)}
                      onCheckedChange={() => handleInviteRoleToggle(role)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">{rc.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {rc.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              An email will be sent with a secure login link valid for 48 hours.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={
                  !inviteForm.fullName ||
                  !inviteForm.email ||
                  inviteForm.roles.length === 0 ||
                  inviteMutation.isPending
                }
              >
                {inviteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Drawer */}
      <Sheet open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <SheetContent className="w-[480px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
          </SheetHeader>
          {editUser && (
            <div className="space-y-6 pt-6">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-navy text-white text-lg">
                    {getInitials(editName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editUser.email} disabled className="bg-muted/50" />
                <p className="text-[11px] text-muted-foreground">
                  Contact support to change email.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as UserStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {editUser.status === "suspended" && editUser.suspendedReason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-xs">
                    <p className="font-medium text-red-600">
                      Reason: {editUser.suspendedReason}
                    </p>
                    {editUser.suspendedAt && (
                      <p className="text-red-500 mt-1">
                        Suspended on{" "}
                        {new Date(editUser.suspendedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Roles */}
              <div className="space-y-3">
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {editRoles.map((role) => {
                    const rc = USER_ROLE_CONFIG[role];
                    if (!rc) return null;
                    return (
                      <Badge
                        key={role}
                        variant="outline"
                        className={`${rc.color} gap-1 pr-1`}
                      >
                        {rc.label}
                        <button
                          onClick={() => handleRemoveEditRole(role)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {editRoles.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      No roles assigned
                    </span>
                  )}
                </div>
                <Select onValueChange={(v) => handleAddEditRole(v as UserRole)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.filter((r) => !editRoles.includes(r)).map(
                      (role) => (
                        <SelectItem key={role} value={role}>
                          {USER_ROLE_CONFIG[role].label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetPassword(editUser.id)}
                  disabled={resetPasswordMutation.isPending}
                >
                  <KeyRound className="h-3.5 w-3.5 mr-1" />
                  Reset Password
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDeactivate(editUser.id);
                    setEditUser(null);
                  }}
                >
                  <UserX className="h-3.5 w-3.5 mr-1" />
                  Deactivate
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
