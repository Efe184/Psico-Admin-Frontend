"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBlogApprovals } from "@/hooks/use-blog-approvals";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BlogApprovalsView() {
  const { approvals, setApprovals, loading, error, refetch } = useBlogApprovals();
  const [selected, setSelected] = useState<BlogApprovalDto | null>(null);

  const removeFromQueue = (id: string, action: "approved" | "rejected") => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    toast.success(
      action === "approved"
        ? "Blog yazısı onaylandı (yerel, API TODO)"
        : "Blog yazısı reddedildi (yerel, API TODO)"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Blog onayları
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uzmanlar tarafından gönderilen bloglar önce bu kuyruğa düşer. Yazar ve
          içerik bilgisiyle inceleyip onaylayabilirsiniz.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Blog onay kuyruğu yükleniyor...
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error && !loading ? (
        <Card className="border-[#EB5757]/30 bg-[#EB5757]/5">
          <CardContent className="flex flex-col gap-3 py-6">
            <p className="text-sm text-[#EB5757]">{error}</p>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => void refetch()}
            >
              Tekrar dene
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && approvals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Onay bekleyen blog bulunmuyor.
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && approvals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {approvals.map((item) => (
            <Card
              key={item.id}
              className="rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-[#F2994A]/40 bg-[#F2994A]/10 text-[#F2994A]"
                  >
                    Onay Bekliyor
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.submittedAt}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-[#24292E] dark:text-muted-foreground">
                  Yazar: {item.authorName}
                </p>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(item)}
                  >
                    Detay Gör
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#27AE60] hover:bg-[#229954] active:bg-[#1e874b]"
                    onClick={() => removeFromQueue(item.id, "approved")}
                  >
                    Onayla
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFromQueue(item.id, "rejected")}
                  >
                    Reddet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.authorName} • {selected.submittedAt}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/20 p-4 text-sm leading-6 text-foreground">
                {selected.content}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
