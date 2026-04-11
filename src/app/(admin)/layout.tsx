"use client";

import { useMemo, useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingStub = useMemo(() => 6, []);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col px-2 py-4 sm:px-4 lg:px-6">
        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r bg-card p-4 shadow-lg transition-transform duration-200 md:static md:z-0 md:max-w-none md:shrink-0 md:rounded-lg md:border md:shadow-sm",
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
          >
            <AdminSidebar />
          </div>
          {sidebarOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              aria-label="Menüyü kapat"
              onClick={() => setSidebarOpen(false)}
            />
          ) : null}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
              <AdminTopBar
                pendingCount={pendingStub}
                onMenuClick={() => setSidebarOpen((o) => !o)}
              />
              <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
