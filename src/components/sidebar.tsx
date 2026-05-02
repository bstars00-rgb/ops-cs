"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Folder,
  CalendarDays,
  CheckCircle2,
  Siren,
  Building2,
  Hotel,
  FileText,
  Wallet,
  ShieldCheck,
  ClipboardList,
  Mail,
  BarChart3,
  Settings,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeKind?: "neutral" | "warn" | "danger";
  shortcut?: string;
};

const main: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, shortcut: "d" },
  { href: "/inbox", label: "Inbox", icon: Inbox, badge: "12", shortcut: "i" },
  { href: "/cases", label: "Cases", icon: Folder, badge: "47", shortcut: "c" },
  { href: "/reservations", label: "Reservations", icon: CalendarDays, shortcut: "r" },
  { href: "/approvals", label: "Approval Queue", icon: CheckCircle2, badge: "9", shortcut: "a" },
  {
    href: "/escalations",
    label: "Escalations",
    icon: Siren,
    badge: "3",
    badgeKind: "danger",
    shortcut: "e",
  },
];

const masterData: NavItem[] = [
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/hotels", label: "Hotels & Suppliers", icon: Hotel },
];

const finance: NavItem[] = [
  { href: "/billing", label: "Billing", icon: FileText },
  { href: "/outstanding", label: "Outstanding", icon: Wallet, badge: "4", badgeKind: "warn" },
  { href: "/credit", label: "Credit Control", icon: ShieldCheck, badge: "5", badgeKind: "warn" },
];

const system: NavItem[] = [
  { href: "/sop", label: "SOP Library", icon: ClipboardList },
  { href: "/templates", label: "Templates", icon: Mail },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link href={item.href} className={cn("nav-item", active && "nav-item-active")}>
      <Icon className="w-4 h-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full",
            item.badgeKind === "danger"
              ? "bg-risk-crit/20 text-risk-crit"
              : item.badgeKind === "warn"
              ? "bg-risk-med/20 text-risk-med"
              : "bg-bg-soft text-fg-muted"
          )}
        >
          {item.badge}
        </span>
      )}
      {item.shortcut && !item.badge && (
        <kbd className="kbd opacity-0 group-hover:opacity-100">{item.shortcut}</kbd>
      )}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="w-60 border-r border-border bg-bg-soft flex flex-col">
      <div className="px-4 h-14 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center">
          <Plane className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-fg leading-tight">OpsCS</span>
          <span className="text-[10px] text-fg-subtle leading-tight">
            Travel Operations OS
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {main.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <div className="nav-section">Master Data</div>
        {masterData.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <div className="nav-section">Finance</div>
        {finance.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <div className="nav-section">System</div>
        {system.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-[11px] font-medium">
            SL
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Sarah Lee</div>
            <div className="text-[10px] text-fg-subtle truncate">OPS · reseller-kr</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
