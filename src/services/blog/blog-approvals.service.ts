import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type { BlogApprovalDto } from "@/types/dto/blog-approval";

export const MOCK_BLOG_APPROVALS: BlogApprovalDto[] = [
  {
    id: "BA-001",
    title: "Kaygı Bozukluklarında Günlük Rutin Önerileri",
    excerpt:
      "Düzenli uyku, kısa nefes egzersizleri ve gün içi planlama ile kaygı belirtileri daha yönetilebilir hale gelir.",
    content:
      "Kaygı bozukluklarında küçük ama sürdürülebilir adımlar önemlidir. Her gün aynı saatte uyanmak, kafein tüketimini azaltmak ve gün sonunda kısa bir değerlendirme yapmak semptom yönetimini destekler. Danışanların bireysel farklılıklarına göre plan kişiselleştirilmelidir.",
    authorName: "Uzm. Psk. Gökhan Er",
    submittedAt: "2026-04-09",
    status: "pending",
  },
  {
    id: "BA-002",
    title: "Çift Terapisinde İletişim Çatışmalarını Azaltma",
    excerpt:
      "Ben dili kullanımı, aktif dinleme ve duygu yansıtma teknikleri iletişim çatışmalarını azaltmada etkilidir.",
    content:
      "Çift terapisi süreçlerinde temel hedef tarafların birbirini duyabilmesini sağlamaktır. Seanslarda ben dili kullanımına geçiş, aktif dinleme egzersizleri ve yapılandırılmış geri bildirim döngüsü önerilir. Ev ödevi olarak haftalık 20 dakikalık kesintisiz paylaşım zamanı planlanabilir.",
    authorName: "Klinik Psk. Zeynep Uçar",
    submittedAt: "2026-04-10",
    status: "pending",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapBlogRow(row: Record<string, unknown>): BlogApprovalDto {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? row.summary ?? ""),
    content: String(row.content ?? row.body ?? ""),
    authorName: String(
      row.author_name ?? row.authorName ?? row.author ?? ""
    ).trim(),
    submittedAt: String(row.submitted_at ?? row.submittedAt ?? ""),
    status: "pending",
  };
}

/**
 * Lists expert-submitted blog posts waiting for admin approval.
 */
export async function listPendingBlogApprovals(): Promise<BlogApprovalDto[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return Promise.resolve(MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending"));
  }

  try {
    const res = await fetch(`${base}/admin/blog-approvals?status=pending`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      return MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending");
    }
    const json = (await res.json()) as
      | ApiResponse<BlogApprovalDto[] | { posts: BlogApprovalDto[] }>
      | BlogApprovalDto[];

    if (Array.isArray(json)) {
      return json.map((r) => mapBlogRow(r as unknown as Record<string, unknown>));
    }
    if (!json || typeof json !== "object" || !("success" in json) || !json.success) {
      return MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending");
    }
    const data = json.data;
    if (Array.isArray(data)) {
      return data.map((r) => mapBlogRow(r as unknown as Record<string, unknown>));
    }
    if (isRecord(data) && Array.isArray(data.posts)) {
      return data.posts.map((r) => mapBlogRow(r as unknown as Record<string, unknown>));
    }
    return MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending");
  } catch {
    return MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending");
  }
}

/** POST /admin/blog-approvals/:id/approve */
export async function approveBlogApproval(postId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blog-approvals/${postId}/approve`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error((await res.text().catch(() => null)) || res.statusText);
  }
  const payload = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
  if (payload && typeof payload.success === "boolean" && !payload.success) {
    throw new Error(payload.message || "Onay başarısız");
  }
}

/** POST /admin/blog-approvals/:id/reject */
export async function rejectBlogApproval(
  postId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blog-approvals/${postId}/reject`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      revisionNote,
      revision_note: revisionNote,
    }),
  });
  if (!res.ok) {
    throw new Error((await res.text().catch(() => null)) || res.statusText);
  }
  const payload = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
  if (payload && typeof payload.success === "boolean" && !payload.success) {
    throw new Error(payload.message || "Red başarısız");
  }
}

/** PATCH /admin/blog-approvals/:id — admin-edited draft still pending expert notification */
export async function submitAdminBlogRevision(
  postId: string,
  body: { title: string; excerpt: string; content: string }
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/blog-approvals/${postId}`, {
    method: "PATCH",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
    }),
  });
  if (!res.ok) {
    throw new Error((await res.text().catch(() => null)) || res.statusText);
  }
  const payload = (await res.json().catch(() => null)) as ApiResponse<unknown> | null;
  if (payload && typeof payload.success === "boolean" && !payload.success) {
    throw new Error(payload.message || "Revizyon kaydedilemedi");
  }
}
