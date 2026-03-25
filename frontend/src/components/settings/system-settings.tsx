"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "./general-settings";
import { DataFreshnessTab } from "./data-freshness-settings";
import { PackageRulesTab } from "./package-rules-settings";
import { ApiIntegrationsTab } from "./api-integrations-settings";
import { NotificationsTab } from "./notifications-settings";
import { ApiAuditLogTab } from "./api-audit-log-settings";
import {
  Settings,
  Clock,
  Package,
  Plug,
  BellRing,
  ShieldCheck,
} from "lucide-react";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure system-wide defaults, rules, and integrations
        </p>
      </div>

      {/* Tabbed Layout */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm">
            <Settings className="h-3.5 w-3.5 hidden sm:block" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="freshness"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Clock className="h-3.5 w-3.5 hidden sm:block" />
            Data Freshness
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Package className="h-3.5 w-3.5 hidden sm:block" />
            Package Rules
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <Plug className="h-3.5 w-3.5 hidden sm:block" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <BellRing className="h-3.5 w-3.5 hidden sm:block" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-xs sm:text-sm">
            <ShieldCheck className="h-3.5 w-3.5 hidden sm:block" />
            API Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="freshness">
          <DataFreshnessTab />
        </TabsContent>

        <TabsContent value="packages">
          <PackageRulesTab />
        </TabsContent>

        <TabsContent value="integrations">
          <ApiIntegrationsTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="audit">
          <ApiAuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
