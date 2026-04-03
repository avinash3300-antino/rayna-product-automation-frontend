"use client";

import { ReviewQueue } from "@/components/review/review-queue";

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground">
          Review and approve classification and content records
        </p>
      </div>

      <ReviewQueue />
    </div>
  );
}
