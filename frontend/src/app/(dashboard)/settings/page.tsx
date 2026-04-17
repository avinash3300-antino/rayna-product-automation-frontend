"use client";

import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SystemSettings } from "@/components/settings/system-settings";

function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access System Settings. This page is
          restricted to administrators only. Contact your system administrator
          if you believe this is an error.
        </p>
      </Card>
    </div>
  );
}

function useIsAdmin(): boolean {
  const { data: session } = useSession();
  const roles = session?.user?.roles;
  if (!roles) return false;
  return roles.includes("admin");
}

export default function SettingsPage() {
  const isAdmin = useIsAdmin();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return <SystemSettings />;
}
