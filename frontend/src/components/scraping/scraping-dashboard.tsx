"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScrapeJobs } from "@/hooks/api/use-scraping";
import { useDestinations } from "@/hooks/api/use-destinations";
import { ScrapeJobsTable } from "./scrape-jobs-table";
import { JobDetailSheet } from "./job-detail-sheet";
import type { ScrapeJob } from "@/types/scraping";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "scraping", label: "Scraping" },
  { value: "extracting", label: "Extracting" },
  { value: "saving", label: "Saving" },
  { value: "enriching", label: "Enriching" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Activities", label: "Activities" },
  { value: "Adventure", label: "Adventure" },
  { value: "Cultural", label: "Cultural" },
  { value: "Water Sports", label: "Water Sports" },
  { value: "Nature", label: "Nature" },
  { value: "Day Trip", label: "Day Trip" },
  { value: "Dinner Cruise", label: "Dinner Cruise" },
  { value: "Sightseeing Cruise", label: "Sightseeing Cruise" },
  { value: "Luxury Cruise", label: "Luxury Cruise" },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "activities", label: "Activities" },
  { value: "cruises", label: "Cruises" },
];

const PAGE_SIZE = 20;

export function ScrapingDashboard() {
  const [cityFilter, setCityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ScrapeJob | null>(null);

  // Fetch destinations for city filter dropdown
  const { data: destinationsData } = useDestinations({ perPage: 100 });

  // Fetch scrape jobs with filters
  const {
    data: jobsData,
    isLoading,
    isError,
  } = useScrapeJobs({
    city_id: cityFilter !== "all" ? cityFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    product_type: productTypeFilter !== "all" ? productTypeFilter : undefined,
    page: currentPage,
    perPage: PAGE_SIZE,
  });

  const jobs = jobsData?.data ?? [];
  const totalJobs = jobsData?.total ?? 0;
  const totalPages = jobsData?.totalPages ?? 1;

  // Compute stats from current page data
  const stats = useMemo(() => {
    return {
      total: totalJobs,
      running: jobs.filter(
        (j) =>
          j.status === "scraping" ||
          j.status === "extracting" ||
          j.status === "saving" ||
          j.status === "enriching"
      ).length,
      completed: jobs.filter((j) => j.status === "completed").length,
      failed: jobs.filter((j) => j.status === "failed").length,
    };
  }, [jobs, totalJobs]);

  // Destinations list for city dropdown
  const destinations = destinationsData?.data ?? [];

  // Handle filter changes (reset page)
  const handleCityChange = useCallback((val: string) => {
    setCityFilter(val);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handleProductTypeChange = useCallback((val: string) => {
    setProductTypeFilter(val);
    setCurrentPage(1);
  }, []);

  // Handle row click to open sheet
  const handleSelectJob = useCallback((job: ScrapeJob) => {
    setSelectedJob(job);
    setSheetOpen(true);
  }, []);

  // Pagination range
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalJobs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
            <Search className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Scraping Jobs</h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage all web scraping jobs
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={cityFilter} onValueChange={handleCityChange}>
            <SelectTrigger className="w-[180px] bg-navy-light/50 border-border/50">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-navy border-border/50">
              <SelectItem value="all">All Cities</SelectItem>
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.countryFlag} {dest.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[160px] bg-navy-light/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-navy border-border/50">
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] bg-navy-light/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-navy border-border/50">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={productTypeFilter} onValueChange={handleProductTypeChange}>
            <SelectTrigger className="w-[150px] bg-navy-light/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-navy border-border/50">
              {PRODUCT_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-navy-light/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
              <Activity className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
          </div>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.running}</p>
              <p className="text-sm text-muted-foreground">Running</p>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {stats.completed}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-4 ${
            stats.failed > 0
              ? "border-red-500/20 bg-red-500/5"
              : "border-border/50 bg-navy-light/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                stats.failed > 0 ? "bg-red-500/20" : "bg-gray-500/20"
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  stats.failed > 0 ? "text-red-400" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  stats.failed > 0 ? "text-red-400" : "text-foreground"
                }`}
              >
                {stats.failed}
              </p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card className="border-border/50 bg-navy-light/30 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Scrape Jobs</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalJobs} jobs found
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
            <span className="ml-3 text-sm text-muted-foreground">
              Loading scrape jobs...
            </span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
            <p className="text-sm text-muted-foreground">
              Failed to load scrape jobs. Please try again.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Clock className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No scrape jobs found matching your filters.
            </p>
          </div>
        ) : (
          <>
            <ScrapeJobsTable jobs={jobs} onSelectJob={handleSelectJob} />

            {/* Pagination */}
            {totalJobs > PAGE_SIZE && (
              <div className="flex items-center justify-between p-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Showing {startIdx + 1}&ndash;{endIdx} of {totalJobs}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="border-border/50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="border-border/50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Side Sheet for quick preview */}
      <JobDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        job={selectedJob}
      />
    </div>
  );
}
