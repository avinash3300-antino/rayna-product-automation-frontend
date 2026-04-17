"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Menu, Search, LogOut, User } from "lucide-react";
import { getPageTitle } from "@/config/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MobileSidebar } from "./mobile-sidebar";
import { LogoutConfirmDialog } from "./logout-confirm-dialog";
import { NotificationsDrawer } from "@/components/monitoring/notifications-drawer";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-monitoring-data";
import type { Notification } from "@/types/monitoring";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const pageTitle = getPageTitle(pathname);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const userName = session?.user?.fullName || session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userPicture = session?.user?.profilePictureUrl;
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 bg-navy border-navy">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-lg font-semibold truncate">{pageTitle}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background"
        />
      </div>

      {/* Notifications */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-navy">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[380px] sm:w-[420px] p-0 bg-background border-border/50"
        >
          <NotificationsDrawer
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onMarkRead={handleMarkRead}
          />
        </SheetContent>
      </Sheet>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              {userPicture && <AvatarImage src={userPicture} alt={userName} />}
              <AvatarFallback className="bg-navy text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </header>
  );
}
