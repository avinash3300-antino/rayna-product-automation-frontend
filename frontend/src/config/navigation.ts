import {
  LayoutDashboard,
  Globe,
  Activity,
  Filter,
  LayoutGrid,
  SlidersHorizontal,
  Link,
  Tag,
  Package,
  CheckCircle,
  History,
  Bell,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  adminOnly?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "PIPELINE",
    items: [
      { title: "Destinations", href: "/destinations", icon: Globe },
      { title: "Ingestion Monitor", href: "/ingestion", icon: Activity },
      {
        title: "Review Queue",
        href: "/review",
        icon: Filter,
        badge: 20,
      },
    ],
  },
  {
    label: "CATALOG",
    items: [
      { title: "Product Browser", href: "/products", icon: LayoutGrid },
      {
        title: "Attribute Editor",
        href: "/attributes",
        icon: SlidersHorizontal,
      },
      {
        title: "Booking Source Mapper",
        href: "/booking-sources",
        icon: Link,
      },
      { title: "Tag Manager", href: "/tags", icon: Tag },
    ],
  },
  {
    label: "PACKAGES",
    items: [
      { title: "Package Builder", href: "/packages", icon: Package },
    ],
  },
  {
    label: "PUBLISHING",
    items: [
      {
        title: "Staging Approval",
        href: "/staging",
        icon: CheckCircle,
      },
      { title: "Push History", href: "/push-history", icon: History },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Monitoring & Alerts",
        href: "/monitoring",
        icon: Bell,
      },
      {
        title: "User Management",
        href: "/users",
        icon: Users,
        adminOnly: true,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        adminOnly: true,
      },
    ],
  },
];

export function getPageTitle(pathname: string): string {
  if (pathname === "/profile") return "My Profile";
  for (const section of navigation) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return item.title;
      }
    }
  }
  return "Dashboard";
}
