"use client";

import { Package, Activity, Filter, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KpiStats } from "@/types/dashboard";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  children?: React.ReactNode;
}

function StatCard({ title, value, icon, accent, children }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        {children && <div className="mt-2">{children}</div>}
      </CardContent>
    </Card>
  );
}

interface StatCardsProps {
  data: KpiStats;
}

export function StatCards({ data }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Products"
        value={data.total_products}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        accent="bg-gold"
      >
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">
            {data.by_status.published} published
          </Badge>
          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">
            {data.by_status.approved} approved
          </Badge>
          <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
            {data.by_status.draft} draft
          </Badge>
        </div>
      </StatCard>

      <StatCard
        title="Active Scrape Jobs"
        value={data.active_scrape_jobs}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        accent="bg-chart-1"
      >
        {data.is_scraping_running && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-chart-1" />
            <span>Processing…</span>
          </div>
        )}
      </StatCard>

      <StatCard
        title="Enriched — Pending Review"
        value={data.by_status.enriched}
        icon={<Filter className="h-4 w-4 text-muted-foreground" />}
        accent="bg-chart-2"
      >
        <p className="text-xs text-muted-foreground">Ready for review</p>
      </StatCard>

      <StatCard
        title="Review Ready"
        value={data.by_status.review_ready}
        icon={<Pencil className="h-4 w-4 text-muted-foreground" />}
        accent="bg-chart-4"
      >
        <p className="text-xs text-muted-foreground">Awaiting approval</p>
      </StatCard>
    </div>
  );
}
