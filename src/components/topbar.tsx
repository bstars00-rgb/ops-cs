"use client";

import { Search, Plus, Bell, Command } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-14 border-b border-border bg-bg-soft flex items-center px-4 gap-3">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            type="text"
            placeholder="Cases, bookings, clients, hotels 검색..."
            className="w-full bg-bg-card border border-border rounded-md pl-9 pr-12 py-1.5 text-sm
                       placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 focus:bg-bg"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="kbd"><Command className="w-2.5 h-2.5" /></kbd>
            <kbd className="kbd">K</kbd>
          </div>
        </div>
      </div>

      <button className="btn btn-soft">
        <Plus className="w-4 h-4" />
        <span>Create</span>
      </button>

      <button className="btn btn-ghost relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-risk-crit rounded-full" />
      </button>

      <div className="text-xs text-fg-muted hidden md:flex items-center gap-1.5">
        <div className="pulse-dot text-risk-low" />
        <span>모든 시스템 정상</span>
      </div>
    </header>
  );
}
