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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Gauge, Database, Save } from "lucide-react";
import type { GeneralSettings } from "@/types/settings";
import {
  MOCK_GENERAL_SETTINGS,
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/mock-settings-data";

export function GeneralSettingsTab() {
  const [settings, setSettings] = useState<GeneralSettings>(
    MOCK_GENERAL_SETTINGS
  );

  return (
    <div className="space-y-6">
      {/* System Identity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">System Identity</CardTitle>
              <CardDescription>
                Core identification settings for the automation platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.identity.systemName}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    identity: { ...s.identity, systemName: e.target.value },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Default Currency Code</Label>
              <Select
                value={settings.identity.defaultCurrency}
                onValueChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    identity: { ...s.identity, defaultCurrency: v },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Timezone</Label>
              <Select
                value={settings.identity.defaultTimezone}
                onValueChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    identity: { ...s.identity, defaultTimezone: v },
                  }))
                }
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
            </div>
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select
                value={settings.identity.defaultLanguage}
                onValueChange={(v) =>
                  setSettings((s) => ({
                    ...s,
                    identity: { ...s.identity, defaultLanguage: v },
                  }))
                }
              >
                <SelectTrigger>
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

      {/* Pipeline Defaults */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Gauge className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">Pipeline Defaults</CardTitle>
              <CardDescription>
                Confidence thresholds and processing parameters
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-classify threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Auto-classify confidence threshold</Label>
              <span className="text-sm font-mono font-semibold">
                {settings.pipeline.autoClassifyThreshold.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[settings.pipeline.autoClassifyThreshold]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) =>
                setSettings((s) => ({
                  ...s,
                  pipeline: { ...s.pipeline, autoClassifyThreshold: v },
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Records above this score are auto-classified without human review
            </p>
          </div>

          {/* Human review threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Human review confidence threshold</Label>
              <span className="text-sm font-mono font-semibold">
                {settings.pipeline.humanReviewThreshold.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[settings.pipeline.humanReviewThreshold]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) =>
                setSettings((s) => ({
                  ...s,
                  pipeline: { ...s.pipeline, humanReviewThreshold: v },
                }))
              }
            />
          </div>

          {/* Scraping confidence minimum */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Scraping confidence minimum</Label>
              <span className="text-sm font-mono font-semibold">
                {settings.pipeline.scrapingConfidenceMin.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[settings.pipeline.scrapingConfidenceMin]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([v]) =>
                setSettings((s) => ({
                  ...s,
                  pipeline: { ...s.pipeline, scrapingConfidenceMin: v },
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Records below this go to Queue A
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="samplingRate">
                Content review sampling rate (%)
              </Label>
              <Input
                id="samplingRate"
                type="number"
                min={0}
                max={100}
                value={settings.pipeline.contentReviewSamplingRate}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    pipeline: {
                      ...s.pipeline,
                      contentReviewSamplingRate: Number(e.target.value),
                    },
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Sampling rate for existing destinations
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRegen">Max content regeneration attempts</Label>
              <Input
                id="maxRegen"
                type="number"
                min={1}
                max={10}
                value={settings.pipeline.maxContentRegenAttempts}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    pipeline: {
                      ...s.pipeline,
                      maxContentRegenAttempts: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingestion Defaults */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Database className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-base">Ingestion Defaults</CardTitle>
              <CardDescription>
                Data ingestion rate limits and retry behavior
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="autoProceed">
                Intelligence filter auto-proceed timeout (hours)
              </Label>
              <Input
                id="autoProceed"
                type="number"
                min={1}
                value={settings.ingestion.filterAutoProceedTimeoutHours}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    ingestion: {
                      ...s.ingestion,
                      filterAutoProceedTimeoutHours: Number(e.target.value),
                    },
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                If PM takes no action on filter output, ingestion proceeds
                automatically after this many hours
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rateLimit">
                Max records per ingestion job / min
              </Label>
              <Input
                id="rateLimit"
                type="number"
                min={1}
                value={settings.ingestion.maxRecordsPerMinute}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    ingestion: {
                      ...s.ingestion,
                      maxRecordsPerMinute: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRetry">
                Max retry attempts for failed records
              </Label>
              <Input
                id="maxRetry"
                type="number"
                min={1}
                max={10}
                value={settings.ingestion.maxRetryAttempts}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    ingestion: {
                      ...s.ingestion,
                      maxRetryAttempts: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save General Settings
        </Button>
      </div>
    </div>
  );
}
