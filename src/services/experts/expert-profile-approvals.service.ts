import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type { ExpertProfileApproval } from "@/types/dto/expert-profile-approval";

export const MOCK_EXPERT_PROFILE_APPROVALS: ExpertProfileApproval[] = [
  {
    id: "epa-2001",
    expertId: "EXP-501",
    expertDisplayName: "Uzm. Psk. Deniz Aktaş",
    email: "deniz.aktas@example.com",
    submittedAt: "2026-04-19T11:20:00.000Z",
    status: "pending",
    biography:
      "Yetişkin ve ergen danışanlarıyla çevrimiçi terapi sürdürüyorum; kaygı ve uyku düzenine odaklanıyorum. " +
      "Bilişsel davranışçı tekniklerle kısa süreli hedefler tanımlıyorum. Danışanlarımın günlük yaşamda " +
      "kullanabileceği araçlar sunmayı önemsiyorum. Terapi ortamını güvenli ve yargısız tutmaya çalışıyorum.",
    keywords: ["kaygı", "uyku", "ergen", "online terapi", "BDT"],
    changedFieldsSummary: "Biyografi, anahtar kelimeler, profil fotoğrafı",
  },
  {
    id: "epa-2002",
    expertId: "EXP-502",
    expertDisplayName: "Klinik Psk. Cem Vural",
    email: "cem.vural@example.com",
    submittedAt: "2026-04-18T16:45:00.000Z",
    status: "pending",
    biography:
      "Travma sonrası stres ve yas süreçlerinde deneyimliyim. Çözüm odaklı kısa terapi modelini " +
      "tercih ediyorum. Kurumsal danışmanlık projelerinde yer aldım. Danışanlarıma net bir çerçeve ve " +
      "ölçülebilir ilerleme hedefleri sunuyorum.",
    keywords: ["travma", "yas", "kurumsal", "çözüm odaklı"],
    changedFieldsSummary: "Biyografi, sertifika PDF güncellemesi",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapKeywords(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x)).filter(Boolean);
}

function mapProfileApprovalRow(row: Record<string, unknown>): ExpertProfileApproval {
  const keywords = mapKeywords(row.keywords ?? row.keyword_tags ?? row.keywordTags);
  return {
    id: String(row.id ?? ""),
    expertId: String(row.expert_id ?? row.expertId ?? ""),
    expertDisplayName: String(
      row.expert_display_name ??
        row.expertDisplayName ??
        row.full_name ??
        row.fullName ??
        ""
    ).trim(),
    email: String(row.email ?? ""),
    submittedAt: String(
      row.submitted_at ?? row.submittedAt ?? row.created_at ?? row.createdAt ?? ""
    ),
    status: "pending",
    biography: String(row.biography ?? row.bio ?? ""),
    keywords,
    changedFieldsSummary: String(
      row.changed_fields_summary ??
        row.changedFieldsSummary ??
        row.change_summary ??
        row.changeSummary ??
        ""
    ).trim(),
  };
}

function onlyPending(items: ExpertProfileApproval[]): ExpertProfileApproval[] {
  return items.filter((a) => a.status === "pending");
}

/**
 * GET /admin/expert-profile-approvals?status=pending
 */
export async function listExpertProfileApprovals(): Promise<ExpertProfileApproval[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return onlyPending([...MOCK_EXPERT_PROFILE_APPROVALS]);
  }

  try {
    const res = await fetch(
      `${base}/admin/expert-profile-approvals?status=pending`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      }
    );
    if (!res.ok) {
      return onlyPending([...MOCK_EXPERT_PROFILE_APPROVALS]);
    }
    const json = (await res.json()) as
      | ApiResponse<ExpertProfileApproval[] | { items: ExpertProfileApproval[] }>
      | ExpertProfileApproval[];

    if (Array.isArray(json)) {
      return onlyPending(json.map((r) => mapProfileApprovalRow(r as unknown as Record<string, unknown>)));
    }
    if (!json || typeof json !== "object" || !("success" in json) || !json.success) {
      return onlyPending([...MOCK_EXPERT_PROFILE_APPROVALS]);
    }
    const data = json.data;
    if (Array.isArray(data)) {
      return onlyPending(data.map((r) => mapProfileApprovalRow(r as unknown as Record<string, unknown>)));
    }
    if (isRecord(data) && Array.isArray(data.items)) {
      return onlyPending(
        data.items.map((r) => mapProfileApprovalRow(r as unknown as Record<string, unknown>))
      );
    }
    return onlyPending([...MOCK_EXPERT_PROFILE_APPROVALS]);
  } catch {
    return onlyPending([...MOCK_EXPERT_PROFILE_APPROVALS]);
  }
}

/** POST /admin/expert-profile-approvals/:id/approve */
export async function approveExpertProfileApproval(approvalId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/expert-profile-approvals/${approvalId}/approve`, {
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

/** POST /admin/expert-profile-approvals/:id/reject — revisionNote optional (may be empty) */
export async function rejectExpertProfileApproval(
  approvalId: string,
  revisionNote: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/expert-profile-approvals/${approvalId}/reject`, {
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
    throw new Error(payload.message || "Red işlemi başarısız");
  }
}
