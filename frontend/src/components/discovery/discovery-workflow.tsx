"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, Search, List, Zap, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useTriggerDiscovery,
  useDiscoveryRun,
  useDiscoverySources,
} from "@/hooks/api/use-discovery";
import { RunDiscoveryForm } from "./run-discovery-form";
import { DiscoveryRunStatusCard } from "./discovery-run-status";
import { SourcesTable } from "./sources-table";
import { TriggerScrapingButton } from "./trigger-scraping-button";
import { PipelineProgressPanel } from "./pipeline-progress-panel";
import { toast } from "sonner";

type WorkflowStep = 1 | 2 | 3;

interface StepIndicatorProps {
  step: number;
  currentStep: WorkflowStep;
  label: string;
  icon: React.ReactNode;
}

function StepIndicator({ step, currentStep, label, icon }: StepIndicatorProps) {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
          isCompleted
            ? "bg-emerald-500/20 text-emerald-500"
            : isActive
            ? "bg-[#C9A84C]/20 text-[#C9A84C]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <span>{step}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="hidden sm:inline text-muted-foreground">{icon}</span>
        <span
          className={`text-sm font-medium ${
            isActive
              ? "text-foreground"
              : isCompleted
              ? "text-emerald-500"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const STORAGE_KEY = "discovery-workflow-state";

interface PersistedState {
  currentStep: WorkflowStep;
  currentRunId: string | null;
  selectedCategory: string;
  pipelineJobIds: string[];
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.currentStep === "number") return parsed;
  } catch {
    // ignore corrupt data
  }
  return null;
}

function savePersistedState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function DiscoveryWorkflow() {
  const saved = typeof window !== "undefined" ? loadPersistedState() : null;

  const [currentStep, setCurrentStep] = useState<WorkflowStep>(
    saved?.currentStep ?? 1
  );
  const [currentRunId, setCurrentRunId] = useState<string | null>(
    saved?.currentRunId ?? null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    saved?.selectedCategory ?? ""
  );
  const [pipelineJobIds, setPipelineJobIds] = useState<string[]>(
    saved?.pipelineJobIds ?? []
  );

  // Persist state to localStorage on every change
  useEffect(() => {
    savePersistedState({
      currentStep,
      currentRunId,
      selectedCategory,
      pipelineJobIds,
    });
  }, [currentStep, currentRunId, selectedCategory, pipelineJobIds]);

  const triggerDiscovery = useTriggerDiscovery();

  const {
    data: run,
    isLoading: isRunLoading,
    error: runError,
  } = useDiscoveryRun(currentRunId);

  const {
    data: sources,
    isLoading: isSourcesLoading,
    error: sourcesError,
    refetch: refetchSources,
  } = useDiscoverySources(
    run?.status === "completed" || run?.status === "failed"
      ? currentRunId
      : null
  );

  // Move to step 2 once discovery run starts, and step 3 once sources are viewed
  const isRunComplete =
    run?.status === "completed" || run?.status === "failed";

  function handleTriggerDiscovery(cityId: string, category: string, productType: string = "activities") {
    setSelectedCategory(category);

    triggerDiscovery.mutate(
      { city_id: cityId, category, product_type: productType },
      {
        onSuccess: (data) => {
          setCurrentRunId(data.id);
          setCurrentStep(2);
          toast.success("Discovery run started. Polling for results...");
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to trigger discovery"
          );
        },
      }
    );
  }

  const handleSourcesApproved = useCallback(() => {
    refetchSources();
  }, [refetchSources]);

  function handleMoveToScraping() {
    setCurrentStep(3);
  }

  function handleReset() {
    setCurrentStep(1);
    setCurrentRunId(null);
    setSelectedCategory("");
    setPipelineJobIds([]);
    clearPersistedState();
  }

  const approvedCount = sources?.filter((s) => s.approved).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Source Discovery
          </h2>
          <p className="text-muted-foreground">
            Discover, review, and approve sources for product scraping
          </p>
        </div>
        {currentStep > 1 && (
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Start New Run
          </button>
        )}
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-6 border-b pb-4">
        <StepIndicator
          step={1}
          currentStep={currentStep}
          label="Run Discovery"
          icon={<Search className="h-4 w-4" />}
        />
        <div className="h-px flex-1 bg-border max-w-12" />
        <StepIndicator
          step={2}
          currentStep={currentStep}
          label="Review Sources"
          icon={<List className="h-4 w-4" />}
        />
        <div className="h-px flex-1 bg-border max-w-12" />
        <StepIndicator
          step={3}
          currentStep={currentStep}
          label="Trigger Scraping"
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      {/* Step 1: Run Discovery Form */}
      {currentStep === 1 && (
        <RunDiscoveryForm
          onSubmit={handleTriggerDiscovery}
          isPending={triggerDiscovery.isPending}
        />
      )}

      {/* Step 2: Review Sources */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Run Status */}
          {isRunLoading && !run && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {runError && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Failed to load discovery run. Please try again.
              </p>
            </div>
          )}

          {run && <DiscoveryRunStatusCard run={run} />}

          {/* Sources Table (shown when run is complete) */}
          {isRunComplete && run?.status === "completed" && (
            <>
              {isSourcesLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading sources...
                  </span>
                </div>
              )}

              {sourcesError && (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    Failed to load sources. Please try again.
                  </p>
                </div>
              )}

              {sources && (
                <SourcesTable
                  sources={sources}
                  runId={currentRunId!}
                  onApproved={handleSourcesApproved}
                />
              )}

              {/* Move to scraping step */}
              {sources && sources.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-0">
                      {approvedCount} approved
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ready to proceed to scraping
                    </span>
                  </div>
                  <button
                    onClick={handleMoveToScraping}
                    disabled={approvedCount === 0}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      approvedCount > 0
                        ? "bg-[#C9A84C] text-white hover:bg-[#C9A84C]/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    Proceed to Scraping
                  </button>
                </div>
              )}
            </>
          )}

          {/* If run failed, allow retry */}
          {isRunComplete && run?.status === "failed" && (
            <div className="text-center py-4">
              <button
                onClick={handleReset}
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Try running discovery again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Trigger Scraping */}
      {currentStep === 3 && currentRunId && (
        <div className="space-y-6">
          {run && <DiscoveryRunStatusCard run={run} />}

          <TriggerScrapingButton
            runId={currentRunId}
            category={selectedCategory}
            approvedCount={approvedCount}
            onJobsCreated={setPipelineJobIds}
          />

          {pipelineJobIds.length > 0 && (
            <PipelineProgressPanel jobIds={pipelineJobIds} />
          )}
        </div>
      )}
    </div>
  );
}
