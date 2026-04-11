"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getExpertDetail,
  listExperts,
} from "@/services/users/experts-list.service";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

interface UseExpertsResult {
  experts: ExpertListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  detail: ExpertDetail | null;
  detailLoading: boolean;
  openDetail: (expertId: string) => Promise<void>;
  closeDetail: () => void;
}

export function useExperts(): UseExpertsResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExpertDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listExperts();
      setExperts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Uzman listesi yüklenemedi");
      setExperts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openDetail = useCallback(async (expertId: string) => {
    setDetailLoading(true);
    try {
      const data = await getExpertDetail(expertId);
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    experts,
    loading,
    error,
    refetch: load,
    detail,
    detailLoading,
    openDetail,
    closeDetail,
  };
}
