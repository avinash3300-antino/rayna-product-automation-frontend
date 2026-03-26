"use client";

import { useState } from "react";
import { User, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PersonalInfo } from "@/types/profile";
import { DEPARTMENT_OPTIONS } from "@/lib/mock-profile-data";
import { TIMEZONE_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/mock-settings-data";

interface PersonalInfoTabProps {
  initialInfo: PersonalInfo;
  onDirty: () => void;
}

export function PersonalInfoTab({ initialInfo, onDirty }: PersonalInfoTabProps) {
  const [info, setInfo] = useState<PersonalInfo>(initialInfo);

  function update(patch: Partial<PersonalInfo>) {
    setInfo((prev) => ({ ...prev, ...patch }));
    onDirty();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={info.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
            />
          </div>

          {/* Email (read-only) */}
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={info.email}
              disabled
              className="bg-muted/50"
            />
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              To change your email, contact an Admin
            </p>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={info.jobTitle}
              placeholder="e.g. SEO Content Reviewer"
              onChange={(e) => update({ jobTitle: e.target.value })}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={info.department}
              onValueChange={(v) => update({ department: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={info.phone}
              placeholder="Optional"
              onChange={(e) => update({ phone: e.target.value })}
            />
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={info.timezone}
              onValueChange={(v) => update({ timezone: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Affects how dates and times display for you
            </p>
          </div>

          {/* Language */}
          <div className="sm:col-span-2 space-y-2">
            <Label>Language Preference</Label>
            <Select
              value={info.language}
              onValueChange={(v) => update({ language: v })}
            >
              <SelectTrigger className="sm:w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
