"use client";

import { Clock, UserCheck, Eye, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClassificationQueueStats } from "@/types/classification";

interface ClassificationStatsProps {
  stats: ClassificationQueueStats;
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export function ClassificationStats({ stats }: ClassificationStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Pending"
        value={stats.pending}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        accent="bg-amber-500"
      />
      <StatCard
        title="Assigned to Me"
        value={stats.assignedToMe}
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        accent="bg-chart-2"
      />
      <StatCard
        title="In Review"
        value={stats.inReview}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        accent="bg-chart-1"
      />
      <StatCard
        title="Completed Today"
        value={stats.completedToday}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        accent="bg-emerald-500"
      />
    </div>
  );
}
