import { httpRequest } from "@/lib/http-client";
import type { PendingTaskDto } from "@/types/dto/pending-task";

const MOCK_PENDING_TASKS: PendingTaskDto[] = [
  {
    type: "uzman_basvuru",
    count: 2,
    urgency: "high",
    href: "/uzman-onay/basvurular",
    label: "Yeni uzman başvurusu",
  },
  {
    type: "profil_guncelleme",
    count: 3,
    urgency: "medium",
    href: "/uzman-onay/profil-onaylari",
    label: "Profil güncelleme onayı",
  },
  {
    type: "blog_onay",
    count: 1,
    urgency: "low",
    href: "/icerik/blog-onaylari",
    label: "Blog yazısı incelemede",
  },
];

/**
 * Fetches pending admin tasks. Uses mock data when NEXT_PUBLIC_API_URL is unset.
 */
export async function getPendingTasks(
  accessToken?: string | null
): Promise<PendingTaskDto[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return MOCK_PENDING_TASKS;
  }

  const res = await httpRequest<PendingTaskDto[]>("/admin/pending-tasks", {
    method: "GET",
    accessToken: accessToken ?? undefined,
  });
  return res.data;
}
