import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type { ExpertDetail, ExpertListItem } from "@/types/dto/expert-list";

const MOCK_EXPERT_DETAILS: ExpertDetail[] = [
  {
    id: "EXP-1001",
    fullName: "Uzm. Psk. Ece Karaman",
    email: "ece.karaman@example.com",
    status: "active",
    registeredAt: "2025-09-02",
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

function toList(items: ExpertDetail[]): ExpertListItem[] {
  return items.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    email: item.email,
    status: item.status,
    registeredAt: item.registeredAt,
  }));
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
    const payload = (await res.json()) as ApiResponse<ExpertListItem[]>;
    if (!payload?.success || !Array.isArray(payload.data)) {
      return toList(MOCK_EXPERT_DETAILS);
    }
    return payload.data;
  } catch {
    return toList(MOCK_EXPERT_DETAILS);
  }
}

export async function getExpertDetail(expertId: string): Promise<ExpertDetail | null> {
  const base = getOptionalApiBase();
  if (!base) {
    return MOCK_EXPERT_DETAILS.find((x) => x.id === expertId) ?? null;
  }

  try {
    const res = await fetch(`${base}/admin/experts/${expertId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      return MOCK_EXPERT_DETAILS.find((x) => x.id === expertId) ?? null;
    }
    const payload = (await res.json()) as ApiResponse<ExpertDetail>;
    if (!payload?.success || !payload.data) {
      return MOCK_EXPERT_DETAILS.find((x) => x.id === expertId) ?? null;
    }
    return payload.data;
  } catch {
    return MOCK_EXPERT_DETAILS.find((x) => x.id === expertId) ?? null;
  }
}
