import { getOptionalApiBase } from "@/lib/http-client";
import type { ApiResponse } from "@/types/dto/api";
import type {
  ExpertApplication,
  ExpertApplicationDocument,
} from "@/types/dto/expert-application";

export const MOCK_EXPERT_APPLICATIONS: ExpertApplication[] = [
  {
    id: "ea-1001",
    firstName: "Zeynep",
    lastName: "Arslan",
    phone: "+90 532 000 11 22",
    email: "zeynep.arslan@example.com",
    submittedAt: "2026-04-18T10:30:00.000Z",
    status: "pending",
    certificateDocument: {
      fileName: "sertifika-zeynep-arslan.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    cvDocument: {
      fileName: "cv-zeynep-arslan.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  },
  {
    id: "ea-1002",
    firstName: "Burak",
    lastName: "Öztürk",
    phone: "+90 533 444 55 66",
    email: "burak.ozturk@example.com",
    submittedAt: "2026-04-17T14:05:00.000Z",
    status: "pending",
    certificateDocument: {
      fileName: "diploma-burak.pdf",
    },
    cvDocument: {
      fileName: "ozgecmis-burak.pdf",
    },
  },
  {
    id: "ea-1003",
    firstName: "Elif",
    lastName: "Koç",
    phone: "+90 505 987 65 43",
    email: "elif.koc@example.com",
    submittedAt: "2026-04-16T09:00:00.000Z",
    status: "pending",
    certificateDocument: {
      fileName: "uzmanlik-sertifikasi-elif.pdf",
    },
    cvDocument: {
      fileName: "cv-elif-koc.pdf",
    },
  },
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mapDocFromRow(
  nestedKeys: string[],
  fileNameFlat: string[],
  urlFlat: string[],
  row: Record<string, unknown>
): ExpertApplicationDocument {
  for (const key of nestedKeys) {
    const nested = row[key];
    if (isRecord(nested)) {
      const fileName = String(nested.file_name ?? nested.fileName ?? "").trim();
      if (fileName.length > 0) {
        return {
          fileName,
          url:
            nested.url != null
              ? String(nested.url)
              : nested.signed_url != null
                ? String(nested.signed_url)
                : undefined,
        };
      }
    }
  }
  let fileName = "";
  for (const k of fileNameFlat) {
    if (row[k] != null && String(row[k]).trim()) {
      fileName = String(row[k]).trim();
      break;
    }
  }
  let url: string | undefined;
  for (const k of urlFlat) {
    if (row[k] != null) {
      url = String(row[k]);
      break;
    }
  }
  return { fileName, url };
}

function mapApiRow(row: Record<string, unknown>): ExpertApplication {
  const certificateDocument = mapDocFromRow(
    ["certificate_document", "certificateDocument", "certificate"],
    ["certificate_file_name", "certificateFileName"],
    ["certificate_url", "certificateUrl"],
    row
  );
  const cvDocument = mapDocFromRow(
    ["cv_document", "cvDocument", "cv"],
    ["cv_file_name", "cvFileName"],
    ["cv_url", "cvUrl"],
    row
  );

  return {
    id: String(row.id ?? ""),
    firstName: String(row.first_name ?? row.firstName ?? "").trim(),
    lastName: String(row.last_name ?? row.lastName ?? "").trim(),
    phone: String(row.phone ?? row.phone_number ?? row.phoneNumber ?? ""),
    email: String(row.email ?? ""),
    submittedAt: String(
      row.submitted_at ?? row.submittedAt ?? row.created_at ?? row.createdAt ?? ""
    ),
    status: "pending",
    certificateDocument,
    cvDocument,
  };
}

function onlyPending(items: ExpertApplication[]): ExpertApplication[] {
  return items.filter((a) => a.status === "pending");
}

/**
 * Lists pending expert registration applications.
 * GET /admin/expert-applications?status=pending
 */
export async function listExpertApplications(): Promise<ExpertApplication[]> {
  const base = getOptionalApiBase();
  if (!base) {
    return onlyPending([...MOCK_EXPERT_APPLICATIONS]);
  }

  try {
    const res = await fetch(
      `${base}/admin/expert-applications?status=pending`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      }
    );
    if (!res.ok) {
      return onlyPending([...MOCK_EXPERT_APPLICATIONS]);
    }
    const json = (await res.json()) as
      | ApiResponse<ExpertApplication[] | { applications: ExpertApplication[] }>
      | ExpertApplication[];

    if (Array.isArray(json)) {
      return onlyPending(json.map((r) => mapApiRow(r as unknown as Record<string, unknown>)));
    }
    if (!json || typeof json !== "object" || !("success" in json) || !json.success) {
      return onlyPending([...MOCK_EXPERT_APPLICATIONS]);
    }
    const data = json.data;
    if (Array.isArray(data)) {
      return onlyPending(data.map((r) => mapApiRow(r as unknown as Record<string, unknown>)));
    }
    if (isRecord(data) && Array.isArray(data.applications)) {
      return onlyPending(
        data.applications.map((r) => mapApiRow(r as unknown as Record<string, unknown>))
      );
    }
    return onlyPending([...MOCK_EXPERT_APPLICATIONS]);
  } catch {
    return onlyPending([...MOCK_EXPERT_APPLICATIONS]);
  }
}

/**
 * POST /admin/expert-applications/:id/approve
 */
export async function approveExpertApplication(applicationId: string): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/expert-applications/${applicationId}/approve`, {
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

/**
 * POST /admin/expert-applications/:id/reject
 * Body: { rejectionReason: string }
 */
export async function rejectExpertApplication(
  applicationId: string,
  rejectionReason: string
): Promise<void> {
  const base = getOptionalApiBase();
  if (!base) return;

  const res = await fetch(`${base}/admin/expert-applications/${applicationId}/reject`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      rejectionReason,
      rejection_reason: rejectionReason,
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
