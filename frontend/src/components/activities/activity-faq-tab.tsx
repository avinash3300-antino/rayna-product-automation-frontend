"use client";

import { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGenerateFaqs } from "@/hooks/api/use-activities";
import type { Activity } from "@/types/activities";

interface ActivityFaqTabProps {
  activity: Activity;
}

function FaqItem({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </span>
          <span className="text-sm font-medium">{faq.question}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-0.5",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-[3.25rem]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function ActivityFaqTab({ activity }: ActivityFaqTabProps) {
  const generateFaqs = useGenerateFaqs();
  const faqs = activity.faqs ?? [];

  const handleGenerate = () => {
    generateFaqs.mutate(activity.id, {
      onSuccess: () => {
        toast.success("FAQs generated successfully");
      },
      onError: () => {
        toast.error("Failed to generate FAQs");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <p className="text-sm text-muted-foreground">
            {faqs.length > 0
              ? `${faqs.length} FAQs generated from activity content`
              : "No FAQs yet — generate them using AI"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleGenerate}
          disabled={generateFaqs.isPending}
        >
          {generateFaqs.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {generateFaqs.isPending
            ? "Generating..."
            : faqs.length > 0
              ? "Regenerate FAQs"
              : "Generate FAQs"}
        </Button>
      </div>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <HelpCircle className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">No FAQs yet</p>
            <p className="text-xs mt-1">
              Click &quot;Generate FAQs&quot; to create FAQs from this activity&apos;s content using AI
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs ({faqs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} faq={faq} index={idx} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
