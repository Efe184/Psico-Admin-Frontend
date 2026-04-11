"use client";

import { useCallback, useEffect, useState } from "react";
import { listPendingBlogApprovals } from "@/services/blog/blog-approvals.service";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";

interface UseBlogApprovalsResult {
  approvals: BlogApprovalDto[];
  setApprovals: React.Dispatch<React.SetStateAction<BlogApprovalDto[]>>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBlogApprovals(): UseBlogApprovalsResult {
  const [approvals, setApprovals] = useState<BlogApprovalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingBlogApprovals();
      setApprovals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Blog onay kuyruğu yüklenemedi");
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { approvals, setApprovals, loading, error, refetch: load };
}
