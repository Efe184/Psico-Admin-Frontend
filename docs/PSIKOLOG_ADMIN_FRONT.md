# Psikolog Admin — Front-end architecture

This document is the single source of truth for the `psikolog-admin-web` app: layers, routes, API contract, and alignment with Sportlink-Web-Frontend (theme/UX reference).

## Stack (reference)

- Next.js 15.3.6 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, shadcn/ui (registry), `tw-animate-css`
- Sonner (toasts), Lucide icons, `next-themes`

## Layered architecture

UI must not call `fetch`/`axios` directly. Flow:

1. **Presentation** — `src/app/`, `src/components/admin/`, `src/components/layout/`
2. **Application** — `src/hooks/` (orchestration, loading/error)
3. **Infrastructure** — `src/services/` (functions per domain, e.g. `*.service.ts`)
4. **HTTP** — `src/lib/http-client.ts` (base URL, JSON, `Authorization`)
5. **Contracts** — `src/types/dto/` (TypeScript types / DTOs)

**Rules:**

- No `fetch` in `components/ui` or `components/admin` except through hooks.
- No `React` imports in `services/`.
- Prefer **camelCase** in TS; map API **snake_case** inside `services/` if needed.

### Flow (text diagram)

```
app + components → hooks → services → http-client → backend
                      ↓
                   types/dto
```

## API response shape

Align with backend standard:

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

`httpRequest<T>()` in `src/lib/http-client.ts` throws when `success === false` or non-OK HTTP.

Set `NEXT_PUBLIC_API_URL` when connecting to a real API. If unset, `getPendingTasks()` returns **mock data** for local UI development.

## Auth and middleware

- **Cookies (stub):** `accessToken` (non-empty) and `userRole=admin`.
- **Middleware:** `src/middleware.ts` protects admin routes; unauthenticated users go to `/giris`.
- **TODO:** Decode JWT in middleware (or session service) and verify `role === admin` instead of a plain `userRole` cookie.

**Development:** On `/giris`, use “Geliştirici: admin oturumu simüle et” to set cookies and open `/dashboard`.

## Phase 4 — route map (planned URLs)

Route group `(admin)` does **not** appear in the URL.

| Area | Path |
|------|------|
| Dashboard | `/dashboard` |
| Danışanlar | `/kullanicilar/danisanlar` |
| Admin / personel | `/kullanicilar/adminler` |
| Yeni başvurular | `/uzman-onay/basvurular` |
| Profil onayları | `/uzman-onay/profil-onaylari` |
| Tüm uzmanlar | `/uzmanlar` |
| İçerik yayınla | `/icerik/yayinla` |
| Blog onayları | `/icerik/blog-onaylari` |
| Blog yazıları | `/icerik/blog` |
| Sabit içerik | `/icerik/sayfalar` |
| Gelen talepler | `/formlar/talepler` |
| Mevcut testler | `/formlar/testler` |
| Test sonuçları | `/formlar/test-sonuclari` |
| Test oluşturucu | `/formlar/test-olusturucu` |
| Genel ayarlar | `/ayarlar/genel` |
| Kategoriler | `/ayarlar/kategoriler` |
| E-posta şablonları | `/ayarlar/email-sablonlari` |

Sidebar links point to these paths; individual pages are implemented incrementally.

## Danışan listesi (`/kullanicilar/danisanlar`)

Implemented from Sportlink `dashboard/users` UX (table, mobile cards, filters, rol/durum, uyarı diyaloğu) with psikolog domain labels and layered data access.

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/kullanicilar/danisanlar/page.tsx` |
| View shell | `src/components/admin/danisan-users-view.tsx` |
| Toolbar / table | `danisan-users-toolbar.tsx`, `danisan-users-table.tsx` |
| Dialogs | `danisan-detail-dialog.tsx`, `user-warning-dialog.tsx` |
| DTO | `src/types/dto/user-list.ts` |
| Service | `src/services/users/users-list.service.ts` — `listUsers()` |
| Hook | `src/hooks/use-danisan-users.ts` |
| Auth cookie read | `src/lib/auth-cookies.ts` — `getAccessToken()` (`js-cookie`, cookie name `accessToken`) |

### `GET /users` and response mapping

- Request: `Authorization: Bearer <accessToken>` when present; `credentials: include`.
- **Standard envelope:** `success === true` and `data.users` (array) or `data.USER_DETAILS`.
- **Sportlink-style:** `status === "success"` with the same `data.users` / `data.USER_DETAILS` shape.
- Row mapping accepts `id`, `name` or `first_name` + `last_name`, `email`, `role`, `status` (`aktif` / `active` → active), optional `created_at` / `registeredDate`.
- Legacy Sportlink roles (`bireysel_kullanici`, `antrenor`, `kulup_uyesi`, etc.) are normalized to `danisan` in the UI model unless they match `premium` / `guest`.
- If `NEXT_PUBLIC_API_URL` is missing, HTTP errors occur, or the payload is not recognized as successful, the service falls back to **`MOCK_DANISAN_USERS`** so the screen stays usable offline.

Rol/switch changes and uyarı gönder are **local + toast** until `PATCH` / notification endpoints exist.

## İçerik yayınla (`/icerik/yayinla` + dashboard dialog)

Form layout mirrors Sportlink `NewEventModal` (wide dialog, same field groups). Dashboard opens the same flow via **İçerik yayınla** in quick actions.

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/icerik/yayinla/page.tsx` |
| Dialog | `src/components/admin/content-publish-dialog.tsx` |
| Form | `src/components/admin/content-publish-form.tsx` |
| Dashboard trigger | `src/components/admin/dashboard-content-actions.tsx` |
| DTO | `src/types/dto/content-publish.ts` — `ContentPublishPayload` |
| Service | `src/services/content/content-publish.service.ts` — `submitContentPublish()` |

**API (future):** Replace the mock in `submitContentPublish` with `httpRequest` to the agreed endpoint (e.g. `POST /content/publish` or Supabase RPC). Payload fields: `title`, `description`, `publishDate`, `publishTime`, `channel`, `categoryId`, `categoryLabel`, `durationDays`. Response must use the standard `{ success, data, message }` envelope.

## Gelen talepler (`/formlar/talepler`)

Lists **contact / “Bize Ulaşın”** submissions: full name, email, subject, message, KVKK consent flag, created timestamp, and admin workflow status (`new` | `in_progress` | `resolved`). Matches the public form fields; optional `danisanId` on rows supports deep links from danışan detail (`?danisan=<id>`).

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/formlar/talepler/page.tsx` — wraps view in `Suspense` for `useSearchParams` |
| View | `src/components/admin/incoming-requests-view.tsx` |
| Toolbar / table / message dialog | `incoming-requests-toolbar.tsx`, `incoming-requests-table.tsx`, `incoming-request-message-dialog.tsx` |
| DTO | `src/types/dto/incoming-request.ts` — `IncomingRequest`, `IncomingRequestStatus` |
| Labels | `src/lib/incoming-request-meta.ts` |
| Service | `src/services/forms/incoming-requests.service.ts` — `listIncomingRequests()`, `updateIncomingRequestStatus()`, `MOCK_INCOMING_REQUESTS` |
| Hook | `src/hooks/use-incoming-requests.ts` |

### API contract (target)

- **`GET /admin/contact-requests`** — `Authorization: Bearer <accessToken>` when present; `credentials: include`. Response: `{ success: true, data: { requests: [...] }, message }`. Rows may use snake_case (`full_name`, `created_at`, `kvkk_accepted`, `danisan_id`); the service maps them to the DTO.
- **`PATCH /admin/contact-requests/:id`** — body `{ status: "new" | "in_progress" | "resolved" }`, same auth. Standard `{ success, data?, message }` envelope via `httpRequest`.
- **Public site (separate):** `POST /public/contact` (or Supabase insert) should persist the same fields as the form; not implemented in this app.

If `NEXT_PUBLIC_API_URL` is missing, or `GET` fails / shape is wrong, **`listIncomingRequests`** returns **`MOCK_INCOMING_REQUESTS`**. If the API URL is missing, **`updateIncomingRequestStatus`** is a no-op and the UI keeps optimistic updates with a toast indicating local-only behavior.

## Uzman kayıt başvuruları (`/uzman-onay/basvurular`)

Queues **expert self-registration** data aligned with the public `/uzman/kayit` form (case brief R14): first name, last name, phone, email (password is never shown). Each row includes **certificate** and **CV** document file names and optional signed URLs. **Approve** removes the row from the queue (and calls the backend when `NEXT_PUBLIC_API_URL` is set). **Reject** requires an admin note (case brief R18); the reject form uses **React Hook Form + Zod** (`expertApplicationRejectSchema`, min 10 characters).

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/uzman-onay/basvurular/page.tsx` |
| View + reject dialog | `src/components/admin/expert-applications-view.tsx` |
| DTO | `src/types/dto/expert-application.ts` — `ExpertApplication`, `ExpertApplicationDocument` |
| Zod | `src/lib/expert-application-schemas.ts` |
| Service | `src/services/experts/expert-applications.service.ts` — `listExpertApplications()`, `approveExpertApplication()`, `rejectExpertApplication()`, `MOCK_EXPERT_APPLICATIONS` |
| Hook | `src/hooks/use-expert-applications.ts` |

### API contract (target) — registration queue

- **`GET /admin/expert-applications?status=pending`** — `credentials: include`. Response envelope `{ success: true, data: ExpertApplication[] | { applications: [...] }, message }`. Rows may use snake_case (`first_name`, `certificate_document`, `cv_document`, `submitted_at`); the service maps them to the DTO.
- **`POST /admin/expert-applications/:id/approve`** — optional JSON body `{}`; same auth; standard envelope.
- **`POST /admin/expert-applications/:id/reject`** — body `{ rejectionReason: string }` (server may also accept `rejection_reason`).

If `NEXT_PUBLIC_API_URL` is missing, or `GET` fails / shape is wrong, **`listExpertApplications`** returns **`MOCK_EXPERT_APPLICATIONS`** (pending only). When the API URL is missing, **`approveExpertApplication`** / **`rejectExpertApplication`** are no-ops (no network); the UI still removes the row optimistically and shows success toasts (local-only until the API exists).

## Uzman profil onayları (`/uzman-onay/profil-onaylari`)

Queues **profile revisions** for experts who are already past registration (case brief R20): proposed biography, keywords, and a summary of changed fields. The previously published profile remains visible until the revision is approved. **Reject** opens a dialog with an **optional** revision note (`revisionNote` may be empty); **React Hook Form + Zod** (`expertProfileRejectSchema`, max 2000 characters, no minimum).

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/uzman-onay/profil-onaylari/page.tsx` |
| View + reject dialog | `src/components/admin/expert-profile-approvals-view.tsx` |
| DTO | `src/types/dto/expert-profile-approval.ts` — `ExpertProfileApproval` |
| Zod | `src/lib/expert-profile-approval-schemas.ts` |
| Service | `src/services/experts/expert-profile-approvals.service.ts` — `listExpertProfileApprovals()`, `approveExpertProfileApproval()`, `rejectExpertProfileApproval()`, `MOCK_EXPERT_PROFILE_APPROVALS` |
| Hook | `src/hooks/use-expert-profile-approvals.ts` |

### API contract (target) — profile revision queue

- **`GET /admin/expert-profile-approvals?status=pending`** — envelope `{ success, data: ExpertProfileApproval[] | { items: [...] }, message }`; snake_case field names mapped in the service.
- **`POST /admin/expert-profile-approvals/:id/approve`**
- **`POST /admin/expert-profile-approvals/:id/reject`** — body `{ revisionNote?: string }` (may be empty; also send `revision_note` for compatibility).

Without `NEXT_PUBLIC_API_URL` or on fetch errors, **`listExpertProfileApprovals`** falls back to **`MOCK_EXPERT_PROFILE_APPROVALS`**. Approve/reject network calls are skipped when the base URL is unset; the UI still updates optimistically.

## Blog onayları (`/icerik/blog-onaylari`)

Expert-submitted posts in a pending queue. **Reject** uses an optional **revize notu** (same pattern as profil onayları: RHF + Zod, `blogApprovalRejectSchema`, max 2000 chars, no minimum). The detail dialog lets an admin **edit title, excerpt, and body**, then **Revizyonu kaydet** persists via `PATCH` when the API is set (otherwise local list only). **Onayla** removes the item from the queue.

| Piece | Location |
|-------|----------|
| Page | `src/app/(admin)/icerik/blog-onaylari/page.tsx` |
| View | `src/components/admin/blog-approvals-view.tsx` |
| DTO | `src/types/dto/blog-approval.ts` |
| Zod | `src/lib/blog-approval-schemas.ts` — reject + `blogAdminRevisionSchema` for edits |
| Service | `src/services/blog/blog-approvals.service.ts` — `listPendingBlogApprovals()`, `approveBlogApproval()`, `rejectBlogApproval()`, `submitAdminBlogRevision()` |
| Hook | `src/hooks/use-blog-approvals.ts` |

### API contract (target)

- **`GET /admin/blog-approvals?status=pending`**
- **`POST /admin/blog-approvals/:id/approve`**
- **`POST /admin/blog-approvals/:id/reject`** — body `{ revisionNote?: string }` (optional)
- **`PATCH /admin/blog-approvals/:id`** — body `{ title, excerpt, content }` (admin revision)

## Psikometrik testler (`/formlar/testler`, `test-sonuclari`, `test-olusturucu`)

Admin-defined questionnaires: each **question** has **options** with a **numeric score** when selected; optional **subscales** aggregate scores by question tag; **interpretation bands** map **total score** to labels (e.g. MOCI-style ranges). Scoring is implemented in **`src/lib/psychometric-scoring.ts`** (`computePsychometricScores`).

| Piece | Location |
|-------|----------|
| DTO | `src/types/dto/psychometric-test.ts` |
| Tests service | `src/services/tests/psychometric-tests.service.ts` — `listTests()`, `getTest()`, `saveTest()`, in-memory `testStore` when API unset |
| Results service | `src/services/tests/test-results.service.ts` — `listTestResults()`, `getTestResult()` |
| Hooks | `use-psychometric-tests.ts`, `use-test-results.ts` |
| Mevcut testler | `app/(admin)/formlar/testler/page.tsx`, `tests-list-view.tsx`, `test-detail-dialog.tsx` |
| Test sonuçları | `app/(admin)/formlar/test-sonuclari/page.tsx`, `test-results-view.tsx`, `test-result-detail-dialog.tsx` |
| Test oluşturucu | `app/(admin)/formlar/test-olusturucu/page.tsx`, `psychometric-test-builder-view.tsx`, `psychometric-subscales-editor.tsx`, `psychometric-interpretation-bands-editor.tsx`, `psychometric-questions-editor.tsx` |

**Seed data:** MOCI-like sample (`test-moci-sample`, 37 items, four subscales, four bands) plus a short multi-option sample test; mock submissions in `test-results.service` are scored with `computePsychometricScores` for consistency.

### API contract (target)

- **`GET /admin/psychometric-tests`**, **`GET/PATCH /admin/psychometric-tests/:id`**, **`POST /admin/psychometric-tests`** — list, read, update, create; envelope `{ success, data: { tests } | { test }, message }` (or equivalent); snake_case mapping in services when needed.
- **`GET /admin/test-results?testId=&search=`**, **`GET /admin/test-results/:id`** — list and detail for user submissions.

Without `NEXT_PUBLIC_API_URL`, **`saveTest`** mutates the module **in-memory store** (lost on full reload to seed + user-added tests until refresh clears to defaults in dev — documented in UI copy).

## Sportlink-Web-Frontend — reuse checklist (theme & UX)

Same repository sibling: `Sportlink-Web-Frontend/`. No shared package today; copy patterns manually.

| Item | Sportlink reference | Psikolog admin |
|------|---------------------|----------------|
| Design tokens | `src/app/globals.css` (oklch, shadcn variables) | Same approach; file already aligned via shadcn init |
| Layout shell | `src/app/dashboard/layout.tsx` | `src/app/(admin)/layout.tsx` — `max-w-[1800px]`, muted page bg, card shell |
| Brand accent | `#00A86B` in dashboard header | `#00A86B` in `AdminSidebar` / `AdminTopBar` titles |
| Mobile nav | Drawer + overlay | Same pattern in `(admin)/layout.tsx` |
| Toasts | Sonner in root layout | `AppProviders` + `Toaster` |
| Font | Inter in root layout | `src/app/layout.tsx` uses Inter + `--font-sans` |
| New event modal | `components/modals/NewEventModal.tsx` | `content-publish-form.tsx` / `content-publish-dialog.tsx` (içerik alanları) |

## Localization and comments

- **UI copy:** Turkish (TR).
- **Code comments:** English.

## Phase 2 dependencies (not in initial scaffold)

Add when implementing features:

- **TanStack Table** — large admin tables (`DataTable` wrapper).
- **TipTap** — rich text (blog, static pages, e-mail templates).
- **dnd-kit** — test/form builder ordering.
- **TanStack Query** (optional) — server state in hooks.

## Audit, rate limits, session

Specified in product requirements: audit log UI, API rate limits, session refresh, idle logout. Implement with backend contracts; not wired in this scaffold.
