"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Clock,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SourceHealthCard,
  HealthCheckLog,
  SourceHealthStatus,
} from "@/types/booking-sources";
import {
  HEALTH_STATUS_CONFIG,
  CATEGORY_LABELS,
} from "@/types/booking-sources";
import {
  MOCK_SOURCE_HEALTH_CARDS,
  MOCK_HEALTH_LOGS,
} from "@/lib/mock-booking-sources";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SparklineChart({
  data,
  status,
}: {
  data: { time: string; ms: number }[];
  status: SourceHealthStatus;
}) {
  const color =
    status === "online"
      ? "#10b981"
      : status === "degraded"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <YAxis hide domain={["auto", "auto"]} />
        <Line
          type="monotone"
          dataKey="ms"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HealthMonitor() {
  const [healthCards, setHealthCards] =
    useState<SourceHealthCard[]>(MOCK_SOURCE_HEALTH_CARDS);
  const [logs] = useState<HealthCheckLog[]>(MOCK_HEALTH_LOGS);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [logSourceFilter, setLogSourceFilter] = useState<string>("all");
  const [logStatusFilter, setLogStatusFilter] = useState<string>("all");

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // KPI stats
  const stats = useMemo(() => {
    const online = healthCards.filter((c) => c.status === "online").length;
    const degraded = healthCards.filter((c) => c.status === "degraded").length;
    const offline = healthCards.filter((c) => c.status === "offline").length;
    const onlineCards = healthCards.filter((c) => c.status === "online");
    const avgResponseTime =
      onlineCards.length > 0
        ? Math.round(
            onlineCards.reduce((sum, c) => sum + c.responseTimeMs, 0) /
              onlineCards.length
          )
        : 0;
    return {
      online,
      degraded,
      offline,
      total: healthCards.length,
      avgResponseTime,
    };
  }, [healthCards]);

  // Offline sources for alert banner
  const offlineSources = useMemo(
    () => healthCards.filter((c) => c.status === "offline"),
    [healthCards]
  );

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter((l) => {
        if (logSourceFilter !== "all" && l.sourceId !== logSourceFilter)
          return false;
        if (logStatusFilter !== "all" && l.status !== logStatusFilter)
          return false;
        return true;
      })
      .slice(0, 100);
  }, [logs, logSourceFilter, logStatusFilter]);

  const handleCheckNow = useCallback(
    (sourceId: string) => {
      setHealthCards((prev) =>
        prev.map((c) =>
          c.sourceId === sourceId
            ? { ...c, lastChecked: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Refresh indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3" />
          Last refreshed: {lastRefresh.toLocaleTimeString()} (auto-refreshes
          every 15s)
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setLastRefresh(new Date())}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Refresh Now
        </Button>
      </div>

      {/* Offline alert banner */}
      {offlineSources.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          {offlineSources.map((source) => (
            <div
              key={source.sourceId}
              className="flex items-start gap-3 text-sm"
            >
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-600">
                  {source.sourceName} is offline.{" "}
                  <span className="font-normal text-red-500">
                    Products using it as Source 1 are auto-routed to Source 2.
                  </span>
                </p>
                {source.affectedProductCount > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {source.affectedProductCount} products affected
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Wifi className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.online}
                <span className="text-sm font-normal text-muted-foreground">
                  /{stats.total}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Sources Online</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Activity className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.degraded}</p>
              <p className="text-xs text-muted-foreground">Degraded</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <WifiOff className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.offline}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.avgResponseTime}
                <span className="text-sm font-normal text-muted-foreground">
                  ms
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Source Health Cards Grid */}
      <div>
        <h3 className="text-sm font-medium mb-3">Active Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {healthCards.map((card) => {
            const config = HEALTH_STATUS_CONFIG[card.status];
            return (
              <Card
                key={card.sourceId}
                className={`p-4 border ${
                  card.status === "offline"
                    ? "border-red-500/30"
                    : card.status === "degraded"
                    ? "border-amber-500/30"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm">{card.sourceName}</h4>
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-1 px-1.5 py-0"
                    >
                      {CATEGORY_LABELS[card.category]}
                    </Badge>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${config.dotColor} ${
                        card.status === "online" ? "animate-pulse" : ""
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${config.textColor}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Status-specific content */}
                <div className="mb-3">
                  {card.status === "online" && (
                    <p className="text-lg font-semibold text-emerald-600">
                      {card.responseTimeMs}ms
                    </p>
                  )}
                  {card.status === "degraded" && (
                    <p className="text-lg font-semibold text-amber-600">
                      {card.responseTimeMs}ms
                    </p>
                  )}
                  {card.status === "offline" && card.errorMessage && (
                    <p className="text-xs text-red-500">{card.errorMessage}</p>
                  )}
                </div>

                {/* Sparkline */}
                <div className="mb-3">
                  <SparklineChart
                    data={card.sparkline}
                    status={card.status}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {timeAgo(card.lastChecked)}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => handleCheckNow(card.sourceId)}
                  >
                    Check Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Health Check Log Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Health Check Log</h3>
          <div className="flex items-center gap-2">
            <Select
              value={logSourceFilter}
              onValueChange={setLogSourceFilter}
            >
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {healthCards.map((c) => (
                  <SelectItem key={c.sourceId} value={c.sourceId}>
                    {c.sourceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={logStatusFilter}
              onValueChange={setLogStatusFilter}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="degraded">Degraded</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Error Message</TableHead>
                <TableHead>Checked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const config = HEALTH_STATUS_CONFIG[log.status];
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-sm">
                      {log.sourceName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${config.dotColor}`}
                        />
                        <span className={`text-xs ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.responseTimeMs > 0
                        ? `${log.responseTimeMs}ms`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate">
                      {log.errorMessage || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {timeAgo(log.checkedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
