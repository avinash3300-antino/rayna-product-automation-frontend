"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEP_DEFINITIONS } from "@/lib/mock-packages";
import type { BuilderStep } from "@/types/packages";

interface PackageStepperProps {
  currentStep: BuilderStep;
  onStepClick: (step: BuilderStep) => void;
}

export function PackageStepper({ currentStep, onStepClick }: PackageStepperProps) {
  return (
    <div className="flex items-center w-full mb-8">
      {STEP_DEFINITIONS.map((stepDef, index) => {
        const isCompleted = stepDef.step < currentStep;
        const isActive = stepDef.step === currentStep;
        const isFuture = stepDef.step > currentStep;
        const isClickable = isCompleted;

        return (
          <div key={stepDef.step} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <button
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(stepDef.step)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isCompleted &&
                    "border-gold bg-navy text-gold cursor-pointer hover:bg-navy-light",
                  isActive && "border-gold bg-gold text-navy",
                  isFuture &&
                    "border-border bg-muted text-muted-foreground cursor-default"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepDef.step
                )}
              </button>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium whitespace-nowrap",
                  isActive && "text-foreground",
                  isCompleted && "text-foreground",
                  isFuture && "text-muted-foreground"
                )}
              >
                {stepDef.label}
              </span>
              <span
                className={cn(
                  "text-[10px] hidden sm:block",
                  isFuture ? "text-muted-foreground/50" : "text-muted-foreground"
                )}
              >
                {stepDef.description}
              </span>
            </div>

            {/* Connecting line */}
            {index < STEP_DEFINITIONS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mt-[-20px] transition-colors",
                  isCompleted ? "bg-gold" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
