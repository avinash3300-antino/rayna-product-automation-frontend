"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogout } from "@/hooks/api";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/config/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SheetClose } from "@/components/ui/sheet";

export function MobileSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const logoutMutation = useLogout();
  const isAdmin = session?.user?.roles?.includes("admin") ?? false;
  const userName = session?.user?.fullName || session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col bg-navy">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold text-navy font-bold text-sm">
          R
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Rayna<span className="text-gold">Tours</span>
          </p>
          <p className="text-[10px] text-white/40">Product Automation</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navigation.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.adminOnly || isAdmin
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label}>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-navy-light text-white border-l-2 border-gold"
                              : "text-white/60 hover:bg-navy-light/50 hover:text-white"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate flex-1">{item.title}</span>
                          {item.badge !== undefined && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 min-w-[20px] justify-center bg-gold/20 text-gold text-[10px] px-1.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-gold/20 text-gold text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {userName}
            </p>
            <Badge
              variant="outline"
              className="mt-0.5 h-4 border-gold/30 text-gold text-[9px] px-1"
            >
              {session?.user?.roles?.[0] ?? "user"}
            </Badge>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="text-white/40 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
