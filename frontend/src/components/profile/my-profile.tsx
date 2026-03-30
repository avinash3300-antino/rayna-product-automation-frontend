"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import {
  Save,
  CheckCircle,
  User,
  Shield,
  SlidersHorizontal,
  Clock,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "./profile-card";
import { PersonalInfoTab } from "./personal-info-tab";
import { SecurityTab } from "./security-tab";
import { PreferencesTab } from "./preferences-tab";
import { ActivityTab } from "./activity-tab";
import { useCurrentUser, useUpdateProfile } from "@/hooks/api";
import {
  MOCK_PROFILE_STATS,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_UI_PREFERENCES,
} from "@/lib/mock-profile-data";
import type { PersonalInfo } from "@/types/profile";

export function MyProfile() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const personalInfoRef = useRef<PersonalInfo | null>(null);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaved(false);
  }, []);

  // Build PersonalInfo from the API user data
  const personalInfo = useMemo<PersonalInfo>(
    () => ({
      fullName: currentUser?.fullName ?? "",
      email: currentUser?.email ?? "",
      jobTitle: currentUser?.jobTitle ?? "",
      department: currentUser?.department ?? "",
      phone: currentUser?.phone ?? "",
      timezone: currentUser?.timezone ?? "Asia/Dubai",
      language: "en",
    }),
    [currentUser]
  );

  function handleSave() {
    const info = personalInfoRef.current;
    if (!info) return;
    updateProfileMutation.mutate(
      {
        full_name: info.fullName || undefined,
        job_title: info.jobTitle || undefined,
        department: info.department || undefined,
        phone: info.phone || undefined,
        timezone: info.timezone || undefined,
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal information, security, and preferences
          </p>
        </div>
        <Button
          disabled={(!isDirty && !saved) || updateProfileMutation.isPending}
          onClick={handleSave}
          className="gap-2"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Profile Card */}
        <div className="lg:col-span-1">
          {currentUser && (
            <ProfileCard user={currentUser} stats={MOCK_PROFILE_STATS} />
          )}
        </div>

        {/* Right Column — Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="h-auto flex-wrap gap-1 bg-muted/50 p-1">
              <TabsTrigger
                value="personal"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <User className="h-3.5 w-3.5 hidden sm:block" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Shield className="h-3.5 w-3.5 hidden sm:block" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 hidden sm:block" />
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Clock className="h-3.5 w-3.5 hidden sm:block" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoTab
                initialInfo={personalInfo}
                onDirty={markDirty}
                onInfoChange={(info) => {
                  personalInfoRef.current = info;
                }}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab
                onDirty={markDirty}
              />
            </TabsContent>

            <TabsContent value="preferences">
              <PreferencesTab
                initialNotifPrefs={MOCK_NOTIFICATION_PREFERENCES}
                initialUiPrefs={MOCK_UI_PREFERENCES}
                onDirty={markDirty}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
