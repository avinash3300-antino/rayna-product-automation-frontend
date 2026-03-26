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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plug,
  TestTube2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { ApiIntegration, ConnectionStatus } from "@/types/settings";
import { MOCK_API_INTEGRATIONS } from "@/lib/mock-settings-data";

function getStatusBadge(status: ConnectionStatus) {
  switch (status) {
    case "connected":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Connected
        </Badge>
      );
    case "not_configured":
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          Not Configured
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 gap-1">
          <XCircle className="h-3 w-3" />
          Error
        </Badge>
      );
  }
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return "Never";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApiIntegrationsTab() {
  const [integrations, setIntegrations] =
    useState<ApiIntegration[]>(MOCK_API_INTEGRATIONS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string }>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const testConnection = (api: ApiIntegration) => {
    setTestingId(api.id);
    // Simulate test
    setTimeout(() => {
      const success = api.status !== "not_configured";
      const ms = Math.floor(Math.random() * 300) + 100;
      setTestResults((prev) => ({
        ...prev,
        [api.id]: success
          ? { success: true, message: `Connected (${ms}ms)` }
          : { success: false, message: "Connection refused: check credentials" },
      }));
      setTestingId(null);
    }, 1500);
  };

  const updateConfig = (apiId: string, key: string, value: string | number | boolean) => {
    setIntegrations((prev) =>
      prev.map((a) =>
        a.id === apiId
          ? { ...a, config: { ...a.config, [key]: value } }
          : a
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
          <Plug className="h-4 w-4 text-cyan-500" />
        </div>
        <div>
          <h3 className="text-base font-semibold">API Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Manage connections to external services and APIs
          </p>
        </div>
      </div>

      {integrations.map((api) => (
        <Card key={api.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold">
                  {api.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-sm">{api.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Last call: {formatTimestamp(api.lastSuccessfulCall)}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(api.status)}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={testingId === api.id}
                  onClick={() => testConnection(api)}
                >
                  {testingId === api.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <TestTube2 className="h-3.5 w-3.5" />
                  )}
                  Test
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleExpand(api.id)}
                >
                  {expandedId === api.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Test result */}
            {testResults[api.id] && (
              <div
                className={`mt-2 flex items-center gap-1.5 text-sm ${
                  testResults[api.id].success
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {testResults[api.id].success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {testResults[api.id].message}
              </div>
            )}
          </CardHeader>

          {/* Expanded config */}
          {expandedId === api.id && (
            <CardContent className="pt-0">
              <div className="border-t pt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {api.configFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        {field.label}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={String(api.config[field.key] ?? "")}
                          onValueChange={(v) =>
                            updateConfig(api.id, field.key, v)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "toggle" ? (
                        <Switch
                          checked={api.config[field.key] === "production"}
                          onCheckedChange={(v) =>
                            updateConfig(
                              api.id,
                              field.key,
                              v ? "production" : "sandbox"
                            )
                          }
                        />
                      ) : (
                        <Input
                          type={field.type === "password" ? "password" : field.type}
                          className="h-8"
                          placeholder={field.placeholder}
                          value={String(api.config[field.key] ?? "")}
                          onChange={(e) =>
                            updateConfig(api.id, field.key, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <Button size="sm">Save Configuration</Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
