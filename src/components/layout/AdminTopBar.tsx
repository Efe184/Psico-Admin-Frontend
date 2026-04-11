"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  pendingCount?: number;
  userLabel?: string;
  onMenuClick?: () => void;
}

export function AdminTopBar({
  pendingCount = 0,
  userLabel = "Admin",
  onMenuClick,
}: AdminTopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="text-sm font-semibold sm:text-base">
          <span className="text-[#00A86B] italic">Psikolog</span> Yönetim Paneli
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative gap-2"
        >
          <Bell className="size-4" />
          <span className="hidden sm:inline">Bekleyen</span>
          {pendingCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          ) : null}
        </Button>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {userLabel}
        </span>
        <Link
          href="/giris"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Çıkış
        </Link>
      </div>
    </header>
  );
}
