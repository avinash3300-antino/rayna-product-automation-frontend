"use client";

import { Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/api";
import { StatCards } from "@/components/dashboard/stat-cards";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
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

      {/* Row 2: Recent Jobs */}
      <RecentJobsTable data={data.recent_jobs} />

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductsByDestinationChart data={data.products_by_destination} />
        <ProductsByCategoryChart data={data.products_by_category} />
      </div>
    </div>
  );
}
