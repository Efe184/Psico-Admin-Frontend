import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

const PRIORITY_STORAGE_KEY = "psikolog-admin-expert-priority-scores";

const MOCK_EXPERT_DETAILS: ExpertDetail[] = [
  {
    id: "EXP-1001",
    fullName: "Uzm. Psk. Ece Karaman",
    email: "ece.karaman@example.com",
    status: "active",
    registeredAt: "2025-09-02",
    priorityScore: 10,
    biography:
      "Yetişkin psikoterapisi ve kaygı bozuklukları üzerine çalışan, 8+ yıl deneyimli uzman psikolog.",
    keywords: ["kaygı", "stres", "duygu düzenleme"],
    specialties: ["Bilişsel Davranışçı Terapi", "Yetişkin Terapisi"],
    documents: [
      {
        id: "DOC-1",
        name: "diploma.pdf",
        type: "Diploma",
        uploadedAt: "2025-09-01",
      },
      {
        id: "DOC-2",
        name: "uzmanlik-belgesi.pdf",
        type: "Uzmanlık Belgesi",
        uploadedAt: "2025-09-01",
      },
    ],
  },
  {
    id: "EXP-1002",
    fullName: "Klinik Psk. Kerem Yılmaz",
    email: "kerem.yilmaz@example.com",
    status: "active",
    registeredAt: "2025-10-12",
    priorityScore: 50,
    biography:
      "Ergen danışmanlığı ve aile içi iletişim konularında uzmanlaşmış klinik psikolog.",
    keywords: ["ergen", "aile", "iletişim"],
    specialties: ["Ergen Terapisi", "Aile Danışmanlığı"],
    documents: [
      {
        id: "DOC-3",
        name: "klinik-yetki.pdf",
        type: "Klinik Yetki Belgesi",
        uploadedAt: "2025-10-10",
      },
    ],
  },
  {
    id: "EXP-1003",
    fullName: "Uzm. Psk. Nil Acar",
    email: "nil.acar@example.com",
    status: "inactive",
    registeredAt: "2025-11-05",
    priorityScore: 0,
    biography:
      "Travma sonrası destek süreçleri ve kısa süreli çözüm odaklı terapi yaklaşımında deneyimlidir.",
    keywords: ["travma", "yas", "kriz müdahalesi"],
    specialties: ["Travma Terapisi", "Çözüm Odaklı Terapi"],
    documents: [
      {
        id: "DOC-4",
        name: "sertifika-travma.pdf",
        type: "Sertifika",
        uploadedAt: "2025-11-03",
      },
    ],
  },
];

type ExpertListRow = ExpertListItem & { priority_score?: number };

export function clampExpertPriorityScore(raw: number): number {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 999_999) return 999_999;
  return n;
}

export function sortExpertsByPriority(items: ExpertListItem[]): ExpertListItem[] {
  return [...items].sort((a, b) => {
    const diff = (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName, "tr");
  });
}

function readStoredPriorityMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PRIORITY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const n = clampExpertPriorityScore(Number(v));
      out[k] = n;
    }
    return out;
  } catch {
    return {};
  }
}

function persistStoredPriorityMap(map: Record<string, number>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private mode */
  }
}

function mergeRowPriority(row: ExpertListRow): ExpertListItem {
  const fromApi =
    typeof row.priorityScore === "number"
      ? row.priorityScore
      : typeof row.priority_score === "number"
        ? row.priority_score
        : undefined;
  const stored = readStoredPriorityMap()[row.id];
  const priorityScore =
    stored !== undefined ? stored : clampExpertPriorityScore(fromApi ?? 0);

  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    status: row.status,
    registeredAt: row.registeredAt,
    priorityScore,
  };
}

function toList(items: ExpertDetail[]): ExpertListItem[] {
  return sortExpertsByPriority(
    items.map((item) =>
      mergeRowPriority({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        status: item.status,
        registeredAt: item.registeredAt,
        priorityScore: item.priorityScore,
      })
    )
  );
}

export async function listExperts(): Promise<ExpertListItem[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return toList(MOCK_EXPERT_DETAILS);
  }

  try {
    const res = await fetch(`${base}/admin/experts`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      return toList(MOCK_EXPERT_DETAILS);
    }
    const payload = (await res.json()) as ApiResponse<ExpertListRow[]>;
    if (!payload?.success || !Array.isArray(payload.data)) {
      return toList(MOCK_EXPERT_DETAILS);
    }
    return sortExpertsByPriority(payload.data.map((row) => mergeRowPriority(row)));
  } catch {
    return toList(MOCK_EXPERT_DETAILS);
  }
}

function withMergedPriorityDetail(item: ExpertDetail): ExpertDetail {
  const row = mergeRowPriority(item);
  return {
    ...item,
    priorityScore: row.priorityScore,
  };
}

export async function getExpertDetail(expertId: string): Promise<ExpertDetail | null> {
  const base = getOptionalApiBase();
  if (!base) {
    const found = MOCK_EXPERT_DETAILS.find((x) => x.id === expertId);
    return found ? withMergedPriorityDetail(found) : null;
  }

  try {
    const res = await fetch(`${base}/admin/experts/${expertId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      const found = MOCK_EXPERT_DETAILS.find((x) => x.id === expertId);
      return found ? withMergedPriorityDetail(found) : null;
    }
    const payload = (await res.json()) as ApiResponse<ExpertDetail & { priority_score?: number }>;
    if (!payload?.success || !payload.data) {
      const found = MOCK_EXPERT_DETAILS.find((x) => x.id === expertId);
      return found ? withMergedPriorityDetail(found) : null;
    }
    return withMergedPriorityDetail(payload.data);
  } catch {
    const found = MOCK_EXPERT_DETAILS.find((x) => x.id === expertId);
    return found ? withMergedPriorityDetail(found) : null;
  }
}

/**
 * Persists priority locally; optionally PATCHes the backend when API URL is set.
 * Local overlay wins over API list until the server returns the same field.
 */
export async function updateExpertPriorityScore(
  expertId: string,
  rawScore: number
): Promise<void> {
  const priorityScore = clampExpertPriorityScore(rawScore);
  const map = readStoredPriorityMap();
  map[expertId] = priorityScore;
  persistStoredPriorityMap(map);

  const base = getOptionalApiBase();
  if (!base) return;

  try {
    await fetch(`${base}/admin/experts/${expertId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ priorityScore }),
    });
  } catch {
    /* local overlay remains authoritative for ordering */
  }
}
