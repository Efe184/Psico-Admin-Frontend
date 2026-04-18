"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  ClipboardList,
  Settings,
} from "lucide-react";

type NavItem = { label: string; href: string; badge?: number };

type NavGroup = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [{ label: "Özet ve görevler", href: "/dashboard" }],
  },
  {
    title: "Kullanıcı yönetimi",
    icon: Users,
    items: [
      { label: "Danışanlar", href: "/kullanicilar/danisanlar" },
      { label: "Admin / Personel", href: "/kullanicilar/adminler" },
    ],
  },
  {
    title: "Uzman ve onay",
    icon: Stethoscope,
    items: [
      { label: "Yeni başvurular", href: "/uzman-onay/basvurular", badge: 0 },
      { label: "Profil onayları", href: "/uzman-onay/profil-onaylari" },
      { label: "Tüm uzmanlar", href: "/uzmanlar" },
    ],
  },
  {
    title: "İçerik",
    icon: FileText,
    items: [
      { label: "İçerik yayınla", href: "/icerik/yayinla" },
      { label: "Blog onayları", href: "/icerik/blog-onaylari" },
      { label: "Blog yazıları", href: "/icerik/blog" },
      { label: "Sayfa / sabit içerik", href: "/icerik/sayfalar" },
      { label: "SSS Yayınla", href: "/icerik/sss" },
    ],
  },
  {
    title: "Form ve test",
    icon: ClipboardList,
    items: [
      { label: "Gelen talepler", href: "/formlar/talepler" },
      { label: "Mevcut testler", href: "/formlar/testler" },
      { label: "Test sonuçları", href: "/formlar/test-sonuclari" },
      { label: "Test oluşturucu", href: "/formlar/test-olusturucu" },
    ],
  },
  {
    title: "Sistem",
    icon: Settings,
    items: [
      { label: "Genel ayarlar", href: "/ayarlar/genel" },
      { label: "Filtre / kategori", href: "/ayarlar/kategoriler" },
      { label: "E-posta şablonları", href: "/ayarlar/email-sablonlari" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="px-1">
        <Link href="/dashboard" className="block">
          <span className="text-lg font-semibold tracking-tight text-[#00A86B] italic">
            Psikolog Admin
          </span>
          <p className="mt-1 text-xs text-muted-foreground leading-snug">
            Görev odaklı yönetim paneli. Kritik işler en üstte.
          </p>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon className="size-3.5 shrink-0" />
                {group.title}
              </div>
              <ul className="space-y-0.5 border-l border-border pl-3 ml-1.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-md py-1.5 pl-2 pr-1 text-sm transition-colors",
                          active
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        <span>{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 ? (
                          <span className="rounded-full bg-destructive px-1.5 py-0 text-[10px] font-medium text-destructive-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
