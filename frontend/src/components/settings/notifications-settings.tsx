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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BellRing, Mail, Send, Save } from "lucide-react";
import type { NotificationRule, EmailSenderConfig, NotifyChannel } from "@/types/settings";
import {
  MOCK_NOTIFICATION_RULES,
  MOCK_EMAIL_CONFIG,
} from "@/lib/mock-settings-data";

function getChannelBadge(channel: NotifyChannel) {
  switch (channel) {
    case "in_app":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/25">
          In-App
        </Badge>
      );
    case "email":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/25">
          Email
        </Badge>
      );
    case "in_app_email":
      return (
        <div className="flex gap-1">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/25">
            In-App
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/25">
            Email
          </Badge>
        </div>
      );
  }
}

export function NotificationsTab() {
  const [rules, setRules] = useState<NotificationRule[]>(
    MOCK_NOTIFICATION_RULES
  );
  const [emailConfig, setEmailConfig] =
    useState<EmailSenderConfig>(MOCK_EMAIL_CONFIG);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const sendTestEmail = () => {
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <BellRing className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-base">Notification Rules</CardTitle>
              <CardDescription>
                Configure who gets notified about what events
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Notify Role(s)</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="w-[80px]">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium text-sm">
                    {rule.eventType}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.notifyRoles.map((role) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getChannelBadge(rule.channel)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Sender Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <Mail className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-base">
                Email Sender Configuration
              </CardTitle>
              <CardDescription>
                Configure the sender identity for notification emails
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailConfig.fromName}
                onChange={(e) =>
                  setEmailConfig((c) => ({ ...c, fromName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) =>
                  setEmailConfig((c) => ({ ...c, fromEmail: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={sendTestEmail}
            >
              <Send className="h-4 w-4" />
              {testEmailSent ? "Test Email Sent!" : "Send Test Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}
