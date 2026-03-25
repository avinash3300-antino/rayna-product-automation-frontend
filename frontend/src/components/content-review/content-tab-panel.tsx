"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface ContentTabPanelProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  primaryKeyword: string;
  rows?: number;
  monospace?: boolean;
  disabled?: boolean;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function countKeywordOccurrences(text: string, keyword: string): number {
  if (!keyword || !text) return 0;
  const lower = text.toLowerCase();
  const kw = keyword.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = lower.indexOf(kw, pos)) !== -1) {
    count++;
    pos += kw.length;
  }
  return count;
}

export function ContentTabPanel({
  value,
  onChange,
  label,
  primaryKeyword,
  rows = 6,
  monospace = false,
  disabled = false,
}: ContentTabPanelProps) {
  const wordCount = useMemo(() => countWords(value), [value]);
  const charCount = value.length;
  const keywordCount = useMemo(
    () => countKeywordOccurrences(value, primaryKeyword),
    [value, primaryKeyword]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y",
          monospace && "font-mono text-xs",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>
        <span className="tabular-nums">{charCount} chars</span>
        {primaryKeyword && (
          <span
            className={cn(
              "flex items-center gap-1",
              keywordCount > 0 ? "text-emerald-600" : "text-red-500"
            )}
          >
            <Search className="h-3 w-3" />
            <span className="font-medium">&quot;{primaryKeyword}&quot;</span>
            &mdash;{" "}
            {keywordCount > 0
              ? `${keywordCount} ${keywordCount === 1 ? "occurrence" : "occurrences"}`
              : "not found"}
          </span>
        )}
      </div>
    </div>
  );
}
