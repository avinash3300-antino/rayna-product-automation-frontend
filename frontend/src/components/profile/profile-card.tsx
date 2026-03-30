"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Camera, Calendar, Clock, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUploadProfilePicture, useDeleteProfilePicture } from "@/hooks/api";
import type { AppUser } from "@/types/users";
import { USER_ROLE_CONFIG, USER_STATUS_CONFIG } from "@/types/users";
import type { ProfileStats } from "@/types/profile";
import { formatRelativeTime } from "@/lib/format";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatLastLogin(isoDate: string | null): string {
  if (!isoDate) return "Never";
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 12) return `${hrs}h ago`;

  const today = new Date();
  const loginDate = new Date(isoDate);
  if (
    today.getDate() === loginDate.getDate() &&
    today.getMonth() === loginDate.getMonth() &&
    today.getFullYear() === loginDate.getFullYear()
  ) {
    return `Today at ${loginDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  return formatRelativeTime(isoDate);
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProfileCardProps {
  user: AppUser;
  stats: ProfileStats;
}

export function ProfileCard({ user, stats }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadProfilePicture();
  const deleteMutation = useDeleteProfilePicture();

  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 5MB.");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Profile picture updated.");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to upload profile picture.");
      },
    });

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Profile picture removed.");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to remove profile picture.");
      },
    });
  };

  const pictureUrl = user.profilePictureUrl || user.avatarUrl;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar with upload overlay */}
          <div className="relative group mb-4">
            <Avatar className="h-24 w-24">
              {pictureUrl && (
                <AvatarImage src={pictureUrl} alt={user.fullName} />
              )}
              <AvatarFallback className="bg-navy text-white text-2xl font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Loading overlay */}
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {/* Camera overlay on hover */}
            {!isUploading && !isDeleting && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
              >
                <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            {/* Delete button (only when picture exists) */}
            {pictureUrl && !isUploading && !isDeleting && (
              <button
                type="button"
                onClick={handleDelete}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white shadow-sm hover:bg-destructive/90 transition-colors"
                title="Remove photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Upload Photo button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 mb-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5" />
                {pictureUrl ? "Change Photo" : "Upload Photo"}
              </>
            )}
          </Button>

          {/* Name & Email */}
          <h3 className="text-lg font-semibold">{user.fullName}</h3>
          <p className="text-sm text-muted-foreground mb-3">{user.email}</p>

          {/* Role Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {user.roles.map((role) => {
              const config = USER_ROLE_CONFIG[role];
              return (
                <Badge
                  key={role}
                  variant="outline"
                  className={`text-[11px] ${config.color}`}
                >
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={`text-[11px] mb-4 ${USER_STATUS_CONFIG[user.status].color}`}
          >
            {USER_STATUS_CONFIG[user.status].label}
          </Badge>

          <Separator className="mb-4" />

          {/* Info rows */}
          <div className="w-full space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Member since</span>
              <span className="ml-auto font-medium text-foreground">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Last login</span>
              <span className="ml-auto font-medium text-foreground">
                {formatLastLogin(user.lastLogin)}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Quick Stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xl font-bold">{stats.queueAReviewed}</p>
              <p className="text-[11px] text-muted-foreground">Queue A Reviewed</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xl font-bold">{stats.queueBReviewed}</p>
              <p className="text-[11px] text-muted-foreground">Queue B Reviewed</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xl font-bold">{stats.productsApproved}</p>
              <p className="text-[11px] text-muted-foreground">Products Approved</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xl font-bold">{stats.jobsTriggered}</p>
              <p className="text-[11px] text-muted-foreground">Jobs Triggered</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
