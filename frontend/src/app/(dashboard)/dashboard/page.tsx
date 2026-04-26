"use client";

import { Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/api";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PipelineHealth } from "@/components/dashboard/pipeline-health";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { DataFreshnessHeatmap } from "@/components/dashboard/data-freshness-heatmap";
import { BookingSourceHealth } from "@/components/dashboard/booking-source-health";
import { ProductsByDestinationChart } from "@/components/dashboard/products-by-destination-chart";
import { ProductsByCategoryChart } from "@/components/dashboard/products-by-category-chart";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Cards */}
      <StatCards data={data.kpi} />

      {/* Row 2: Pipeline Health + Recent Jobs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PipelineHealth data={data.pipeline_stages} />
        <RecentJobsTable data={data.recent_jobs} />
      </div>

      {/* Row 3: Data Freshness + Booking Health (static — no backend yet) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DataFreshnessHeatmap />
        </div>
        <BookingSourceHealth />
      </div>

      {/* Row 4: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductsByDestinationChart data={data.products_by_destination} />
        <ProductsByCategoryChart data={data.products_by_category} />
      </div>
    </div>
  );
}
