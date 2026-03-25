"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

function tokenizeJson(json: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match JSON tokens: strings, numbers, booleans, null, punctuation
  const regex =
    /("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\]:,]/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(json)) !== null) {
    // Add any whitespace/newlines between tokens
    if (match.index > lastIndex) {
      nodes.push(json.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = match.index + token.length;
    const isKey = match[1] !== undefined;
    const isString = match[2] !== undefined;

    let className: string;

    if (isKey) {
      className = "text-purple-400";
    } else if (isString) {
      className = "text-emerald-400";
    } else if (token === "true" || token === "false") {
      className = "text-amber-400";
    } else if (token === "null") {
      className = "text-red-400";
    } else if (/^-?\d/.test(token)) {
      className = "text-blue-400";
    } else {
      // Punctuation: { } [ ] : ,
      className = "text-muted-foreground";
    }

    nodes.push(
      <span key={`${match.index}-${key}`} className={className}>
        {token}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text
  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return nodes;
}

export function JsonViewer({ data, className }: JsonViewerProps) {
  const formatted = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokens = useMemo(() => tokenizeJson(formatted), [formatted]);

  return (
    <div
      className={cn(
        "rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto",
        className
      )}
    >
      <pre className="font-mono text-xs leading-relaxed whitespace-pre">
        <code>{tokens}</code>
      </pre>
    </div>
  );
}
