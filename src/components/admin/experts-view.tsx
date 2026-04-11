"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { ExpertDetailDialog } from "@/components/admin/expert-detail-dialog";
import { ExpertsTable } from "@/components/admin/experts-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperts } from "@/hooks/use-experts";

export function ExpertsView() {
  const {
    experts,
    loading,
    error,
    refetch,
    detail,
    detailLoading,
    openDetail,
    closeDetail,
  } = useExperts();
  const [searchQuery, setSearchQuery] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredExperts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return experts;
    return experts.filter(
      (item) =>
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [experts, searchQuery]);

  const handleOpenDetail = async (expertId: string) => {
    setDetailOpen(true);
    await openDetail(expertId);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Tüm uzmanlar
        </h2>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Uzman ara (ad, e-posta, ID)…"
              className="pl-9"
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            Yenile
          </Button>
        </div>
      </div>

      <ExpertsTable
        experts={filteredExperts}
        loading={loading}
        error={error}
        onRefresh={refetch}
        onOpenDetail={(expertId) => void handleOpenDetail(expertId)}
      />

      <div className="rounded-lg border border-[#3178C6]/25 bg-[#3178C6]/5 px-4 py-3 text-sm text-[#24292E] dark:border-[#3178C6]/40 dark:text-foreground">
        <p className="font-medium text-[#3178C6] dark:text-[#6BA3E8]">İpucu</p>
        <p className="mt-1 text-muted-foreground">
          Admin, uzmanların biyografi, anahtar kelime ve belge metadata
          alanlarını detay penceresinden inceleyebilir.
        </p>
      </div>

      <ExpertDetailDialog
        expert={detail}
        loading={detailLoading}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            closeDetail();
            return;
          }
          if (detailLoading) {
            toast.info("Uzman detayı yükleniyor...");
          }
        }}
      />
    </div>
  );
}
