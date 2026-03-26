"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  CheckCircle,
  User,
  Shield,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "./profile-card";
import { PersonalInfoTab } from "./personal-info-tab";
import { SecurityTab } from "./security-tab";
import { PreferencesTab } from "./preferences-tab";
import { ActivityTab } from "./activity-tab";
import { MOCK_USERS } from "@/lib/mock-users";
import {
  MOCK_PERSONAL_INFO,
  MOCK_PROFILE_STATS,
  MOCK_ACTIVE_SESSIONS,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_UI_PREFERENCES,
  MOCK_PROFILE_ACTIVITY,
} from "@/lib/mock-profile-data";

export function MyProfile() {
  const { data: session } = useSession();
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  // Resolve current user from mock data
  const currentUser =
    MOCK_USERS.find((u) => u.email === session?.user?.email) ?? MOCK_USERS[0];

  const markDirty = useCallback(() => {
    setIsDirty(true);
    setSaved(false);
  }, []);

  function handleSave() {
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          disabled={!isDirty && !saved}
          onClick={handleSave}
          className="gap-2"
        >
          {saved ? (
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
          <ProfileCard user={currentUser} stats={MOCK_PROFILE_STATS} />
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
                initialInfo={MOCK_PERSONAL_INFO}
                onDirty={markDirty}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab
                initialSessions={MOCK_ACTIVE_SESSIONS}
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
              <ActivityTab activities={MOCK_PROFILE_ACTIVITY} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
