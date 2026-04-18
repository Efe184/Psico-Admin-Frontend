import { httpRequest } from "@/lib/http-client";
import type { FaqDto, FaqInput } from "@/types/dto/faq";

const INITIAL_MOCK_FAQS: FaqDto[] = [
  {
    id: "FAQ-101",
    question: "Randevumu nasıl oluşturabilirim?",
    answer:
      "Profil sayfanızdan uygun uzmanı seçip takviminde yer alan boş saatlerden birini tıklayarak randevu oluşturabilirsiniz. Onay e-postası randevunun ardından tarafınıza iletilir.",
    category: "randevu",
    order: 1,
    status: "published",
    updatedAt: "2026-04-01",
  },
  {
    id: "FAQ-102",
    question: "Ödemeyi hangi yöntemlerle yapabilirim?",
    answer:
      "Kredi kartı, banka kartı ve IBAN üzerinden havale/EFT kabul edilmektedir. Fatura bilgileriniz randevu sonrası e-posta ile iletilir.",
    category: "odeme",
    order: 2,
    status: "published",
    updatedAt: "2026-04-05",
  },
  {
    id: "FAQ-103",
    question: "Uzmanımı nasıl değiştirebilirim?",
    answer:
      "Profil > Uzmanlarım sekmesinden mevcut uzmanınızla ilişkinizi sonlandırıp yeni bir uzman seçebilirsiniz. Geçmiş görüşme kayıtlarınız yeni uzmanla paylaşılmaz.",
    category: "uzman",
    order: 3,
    status: "published",
    updatedAt: "2026-04-08",
  },
  {
    id: "FAQ-104",
    question: "Görüşme kayıtlarım kimler tarafından görülebilir?",
    answer:
      "Görüşme kayıtlarınız yalnızca sizin ve seçtiğiniz uzmanın erişimindedir. KVKK uyumlu şekilde şifrelenmiş sunucularda saklanır ve üçüncü taraflarla paylaşılmaz.",
    category: "gizlilik",
    order: 4,
    status: "published",
    updatedAt: "2026-04-10",
  },
  {
    id: "FAQ-105",
    question: "Platformu kimler kullanabilir?",
    answer:
      "18 yaş üstü bireyler ücretsiz kayıt olabilir. 18 yaş altı danışanlar için ebeveyn onayı ve uygun uzman eşleştirmesi gerekir.",
    category: "genel",
    order: 5,
    status: "draft",
    updatedAt: "2026-04-12",
  },
];

let MOCK_FAQS: FaqDto[] = [...INITIAL_MOCK_FAQS];

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const nextMockId = (): string => {
  const max = MOCK_FAQS.reduce((acc, faq) => {
    const n = Number(faq.id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 100);
  return `FAQ-${max + 1}`;
};

/**
 * Lists FAQ entries sorted by order ascending.
 * Uses mock data when NEXT_PUBLIC_API_URL is unset.
 */
export async function listFaqs(
  accessToken?: string | null
): Promise<FaqDto[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return [...MOCK_FAQS].sort((a, b) => a.order - b.order);
  }

  const res = await httpRequest<FaqDto[]>("/admin/faqs", {
    method: "GET",
    accessToken: accessToken ?? undefined,
  });
  return res.data;
}

/**
 * Creates a new FAQ entry.
 * TODO: Replace mock branch with backend endpoint when contract is finalized.
 */
export async function createFaq(
  input: FaqInput,
  accessToken?: string | null
): Promise<FaqDto> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    const created: FaqDto = {
      id: nextMockId(),
      ...input,
      updatedAt: todayIso(),
    };
    MOCK_FAQS = [...MOCK_FAQS, created];
    return created;
  }

  const res = await httpRequest<FaqDto>("/admin/faqs", {
    method: "POST",
    body: input,
    accessToken: accessToken ?? undefined,
  });
  return res.data;
}

/**
 * Updates an existing FAQ entry by id.
 */
export async function updateFaq(
  id: string,
  input: FaqInput,
  accessToken?: string | null
): Promise<FaqDto> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    const updated: FaqDto = { id, ...input, updatedAt: todayIso() };
    MOCK_FAQS = MOCK_FAQS.map((f) => (f.id === id ? updated : f));
    return updated;
  }

  const res = await httpRequest<FaqDto>(`/admin/faqs/${id}`, {
    method: "PUT",
    body: input,
    accessToken: accessToken ?? undefined,
  });
  return res.data;
}

/**
 * Deletes an FAQ entry by id.
 */
export async function deleteFaq(
  id: string,
  accessToken?: string | null
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    MOCK_FAQS = MOCK_FAQS.filter((f) => f.id !== id);
    return;
  }

  await httpRequest<null>(`/admin/faqs/${id}`, {
    method: "DELETE",
    accessToken: accessToken ?? undefined,
  });
}
