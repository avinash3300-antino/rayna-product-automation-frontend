"use client";

import { StatCards } from "@/components/dashboard/stat-cards";
import { PipelineHealth } from "@/components/dashboard/pipeline-health";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { DataFreshnessHeatmap } from "@/components/dashboard/data-freshness-heatmap";
import { BookingSourceHealth } from "@/components/dashboard/booking-source-health";
import { ProductsByDestinationChart } from "@/components/dashboard/products-by-destination-chart";
import { ProductsByCategoryChart } from "@/components/dashboard/products-by-category-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Row 1: KPI Cards */}
      <StatCards />

      {/* Row 2: Pipeline Health + Recent Jobs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PipelineHealth />
        <RecentJobsTable />
      </div>

      {/* Row 3: Data Freshness + Booking Health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DataFreshnessHeatmap />
        </div>
        <BookingSourceHealth />
      </div>

      {/* Row 4: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductsByDestinationChart />
        <ProductsByCategoryChart />
      </div>
    </div>
  );
}
