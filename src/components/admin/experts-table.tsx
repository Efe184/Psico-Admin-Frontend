"use client";

import { AlertTriangle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExpertListItem } from "@/types/dto/expert-list";

interface ExpertsTableProps {
  experts: ExpertListItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenDetail: (expertId: string) => void;
}

export function ExpertsTable({
  experts,
  loading,
  error,
  onRefresh,
  onOpenDetail,
}: ExpertsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kayıtlı uzman listesi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : null}

        {error && !loading ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
            <AlertTriangle className="size-8" />
            <p className="text-sm">{error}</p>
            <Button type="button" variant="outline" onClick={() => void onRefresh()}>
              Tekrar dene
            </Button>
          </div>
        ) : null}

        {!loading && !error && experts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Kayıtlı uzman bulunamadı.
          </p>
        ) : null}

        {!loading && !error && experts.length > 0 ? (
          <>
            <div className="grid gap-4 md:hidden">
              {experts.map((expert) => (
                <Card key={expert.id} className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium">{expert.fullName}</p>
                    <p className="text-sm text-muted-foreground">{expert.email}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {expert.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenDetail(expert.id)}
                      >
                        <Eye className="mr-1 size-4" />
                        Detay
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experts.map((expert) => (
                    <TableRow key={expert.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {expert.id}
                      </TableCell>
                      <TableCell className="font-medium">{expert.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {expert.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {expert.status === "active" ? "Aktif" : "Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {expert.registeredAt ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenDetail(expert.id)}
                        >
                          <Eye className="mr-1 size-4" />
                          Detay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
