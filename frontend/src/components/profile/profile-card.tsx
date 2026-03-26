"use client";

import { useState } from "react";
import { Camera, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ProfileCardProps {
  user: AppUser;
  stats: ProfileStats;
}

export function ProfileCard({ user, stats }: ProfileCardProps) {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24 mb-4">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
              <AvatarFallback className="bg-navy text-white text-2xl font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Upload Photo */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 mb-4"
              onClick={() => setUploadOpen(true)}
            >
              <Camera className="h-3.5 w-3.5" />
              Upload Photo
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

      {/* Upload Photo Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50">
              <div className="text-center text-sm text-muted-foreground">
                <Camera className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Drag & drop or</p>
                <p>click to upload</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB. Will be cropped to a circle.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled>
                Upload & Crop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
