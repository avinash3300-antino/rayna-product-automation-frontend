"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Upload,
  Activity,
  Settings,
  CheckCheck,
} from "lucide-react";
import {
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NOTIFICATION_TYPE_LABELS } from "@/types/monitoring";
import type { Notification, NotificationType } from "@/types/monitoring";

interface NotificationsDrawerProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

const typeIcons: Record<NotificationType, React.ElementType> = {
  error: AlertTriangle,
  approval: CheckCircle,
  push: Upload,
  ingestion: Activity,
  system: Settings,
};

const typeIconColors: Record<NotificationType, string> = {
  error: "text-red-400",
  approval: "text-amber-400",
  push: "text-emerald-400",
  ingestion: "text-blue-400",
  system: "text-zinc-400",
};

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsDrawer({
  notifications,
  onMarkAllRead,
  onMarkRead,
}: NotificationsDrawerProps) {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group by type
  const grouped = notifications.reduce(
    (acc, notif) => {
      if (!acc[notif.type]) acc[notif.type] = [];
      acc[notif.type].push(notif);
      return acc;
    },
    {} as Record<NotificationType, Notification[]>
  );

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-foreground">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-normal text-gold">
                ({unreadCount} unread)
              </span>
            )}
          </SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="h-7 text-xs text-muted-foreground hover:text-gold"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </SheetHeader>

      <Separator className="bg-border/50" />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {Object.entries(grouped).map(([type, notifs]) => {
            const notifType = type as NotificationType;
            return (
              <div key={type}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {NOTIFICATION_TYPE_LABELS[notifType]}
                </p>
                <div className="space-y-1">
                  {notifs.map((notif) => {
                    const Icon = typeIcons[notif.type];
                    const iconColor = typeIconColors[notif.type];
                    return (
                      <button
                        key={notif.id}
                        onClick={() => {
                          onMarkRead(notif.id);
                          if (notif.entityLink) {
                            router.push(notif.entityLink);
                          }
                        }}
                        className={cn(
                          "w-full flex items-start gap-3 rounded-md p-2.5 text-left transition-colors hover:bg-navy-light/50",
                          !notif.read && "bg-gold/5"
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4 mt-0.5 shrink-0", iconColor)}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm leading-snug",
                              !notif.read
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            )}
                          >
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatRelativeTime(notif.timestamp)}
                          </p>
                        </div>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-gold shrink-0 mt-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
