import { getOptionalApiBase, httpRequest } from "@/lib/http-client";
import type {
  IncomingRequest,
  IncomingRequestStatus,
} from "@/types/dto/incoming-request";

export const MOCK_INCOMING_REQUESTS: IncomingRequest[] = [
  {
    id: "cr-1",
    fullName: "Ayşe Yılmaz",
    email: "ayse.yilmaz@example.com",
    subject: "Uzman randevusu hakkında",
    message:
      "Merhaba, platform üzerinden nasıl randevu alabileceğimi öğrenmek istiyorum. Teşekkürler.",
    kvkkAccepted: true,
    createdAt: "2026-04-10T14:22:00.000Z",
    status: "new",
  },
  {
    id: "cr-2",
    fullName: "Mehmet Kaya",
    email: "mehmet.k@example.com",
    subject: "Teknik sorun",
    message:
      "Giriş yaptıktan sonra profil sayfam açılmıyor. Tarayıcı: Chrome, son sürüm.",
    kvkkAccepted: true,
    createdAt: "2026-04-09T09:15:00.000Z",
    status: "in_progress",
    danisanId: "1",
  },
  {
    id: "cr-3",
    fullName: "Selin Demir",
    email: "selin.demir@example.com",
    subject: "İş birliği teklifi",
    message:
      "Kurumsal EAP paketleri hakkında bilgi almak istiyoruz. Dönüş yapabilir misiniz?",
    kvkkAccepted: true,
    createdAt: "2026-04-08T11:40:00.000Z",
    status: "resolved",
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapStatus(raw: unknown): IncomingRequestStatus {
  const s = String(raw ?? "").toLowerCase().replace(/\s+/g, "_");
  if (s === "in_progress" || s === "pending" || s === "beklemede") {
    return "in_progress";
  }
  if (s === "resolved" || s === "closed" || s === "tamamlandi" || s === "tamamlandı") {
    return "resolved";
  }
  return "new";
}

function mapOneRequestRow(row: Record<string, unknown>): IncomingRequest {
  const kvkk =
    row.kvkk_accepted === true ||
    row.kvkkAccepted === true ||
    row.kvkk === true;

  return {
    id: String(row.id ?? ""),
    fullName: String(
      row.full_name ?? row.fullName ?? row.name ?? ""
    ).trim(),
    email: String(row.email ?? ""),
    subject: String(row.subject ?? ""),
    message: String(row.message ?? ""),
    kvkkAccepted: Boolean(kvkk),
    createdAt: String(
      row.created_at ?? row.createdAt ?? new Date().toISOString()
    ),
    status: mapStatus(row.status),
    danisanId:
      row.danisan_id != null
        ? String(row.danisan_id)
        : row.danisanId != null
          ? String(row.danisanId)
          : undefined,
  };
}

function responseLooksSuccessful(payload: unknown): boolean {
  if (!isRecord(payload)) return false;
  if (payload.success === true) return true;
  if (payload.status === "success") return true;
  return false;
}

/**
 * Supports { success: true, data: { requests: T[] } } or requests at data root.
 */
export function mapIncomingRequestsFromResponse(
  payload: unknown
): IncomingRequest[] {
  if (!isRecord(payload)) return [];

  const data = isRecord(payload.data) ? payload.data : null;
  if (!data) return [];

  const rawList =
    (Array.isArray(data.requests) ? data.requests : null) ??
    (Array.isArray(data.contact_requests) ? data.contact_requests : null);

  if (!rawList) return [];

  return rawList
    .filter(isRecord)
    .map(mapOneRequestRow)
    .filter((r) => r.id.length > 0);
}

/**
 * GET /admin/contact-requests — mock when API URL missing or request fails.
 */
export async function listIncomingRequests(
  accessToken?: string | null
): Promise<IncomingRequest[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return MOCK_INCOMING_REQUESTS;
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${base}/admin/contact-requests`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("[listIncomingRequests] HTTP", res.status, "- using mock");
      return MOCK_INCOMING_REQUESTS;
    }

    const payload: unknown = await res.json();

    if (!responseLooksSuccessful(payload)) {
      console.warn(
        "[listIncomingRequests] unexpected response shape - using mock"
      );
      return MOCK_INCOMING_REQUESTS;
    }

    const list = mapIncomingRequestsFromResponse(payload);
    return list.length > 0 ? list : MOCK_INCOMING_REQUESTS;
  } catch (e) {
    console.warn("[listIncomingRequests] request failed - using mock", e);
    return MOCK_INCOMING_REQUESTS;
  }
}

/**
 * PATCH /admin/contact-requests/:id with { status }.
 * Resolves with no error when API is unset (caller keeps optimistic UI).
 * Throws when API is set but the request fails.
 */
export async function updateIncomingRequestStatus(
  id: string,
  status: IncomingRequestStatus,
  accessToken?: string | null
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) {
    return;
  }

  await httpRequest<unknown>(
    `/admin/contact-requests/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: { status },
      accessToken,
    }
  );
}
