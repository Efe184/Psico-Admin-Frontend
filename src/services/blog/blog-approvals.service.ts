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

/**
 * Lists expert-submitted blog posts waiting for admin approval.
 * TODO: Replace mock data with backend moderation endpoint.
 */
export async function listPendingBlogApprovals(): Promise<BlogApprovalDto[]> {
  return Promise.resolve(MOCK_BLOG_APPROVALS.filter((x) => x.status === "pending"));
}
