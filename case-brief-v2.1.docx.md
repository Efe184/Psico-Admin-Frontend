**CASE BRIEF**

**Psikolojik Danışmanlık Platformu**

*v2.1  |  Son Revize Sonrası Nihai Sürüm*

| Proje Adı | Psikolojik Danışmanlık Platformu |
| :---- | :---- |
| **Versiyon** | v2.1 — Son Revize Sonrası |
| **Mimari** | Tek Sayfa (No /danisan/ panel) \+ Uzman Paneli \+ Admin |
| **Giriş Kanalları** | Danışan (/giris) | Uzman (/uzman/giris) | Admin (/admin/giris) |
| **Şifre Sıfırlama** | Sadece E-posta — Brevo (Sendinblue) |
| **Sayfa Yükleme** | Skeleton Loading (Framer Motion animasyonu kaldırıldı) |
| **Fiyat Gösterimi** | Sadece /paketler sayfasında (uzman kartında gösterilmez) |
| **Paket Sayısı** | 5 adet (içerik müşteriden alınacak, fiyatlar admin'den) |
| **Kurumsal Sayfa** | /kurumsal — Ayrı sayfa ve header navigasyonu |
| **Renk Paleti** | Fresh Ivy Green \#016a59 \+ shade/tint skalası |
| **Tech Stack** | Next.js 15 \+ NestJS \+ PostgreSQL \+ Prisma \+ Tailwind \+ Brevo |

***🔄  Bu brief v2.1 ile güncellendi. Kırmızı kartlar v2.1'de değişen revizeleri gösterir. Stitch, Figma ve kodda bu brief sürekli açık tutulur.***

# **1\. PROJE ÖZETİ**

## **1.1 Ne Yapıyoruz?**

Psikologlar, psikolojik danışmanlar ve terapistlerin listelendiği; danışanların uzman bulup ücretsiz ön görüşme veya talep formu gönderebileceği bir eşleştirme platformu. Ödeme ve randevu sistemi yoktur (Faz 1). Platform güven odaklıdır: her uzman admin onayından geçer, belgeler danışana açıktır.

## **1.2 Kullanıcı Rolleri**

| Rol | Giriş Noktası | Temel Yetkileri |
| :---- | :---- | :---- |
| Anonim Ziyaretçi | Direkt URL | Uzman listesi, blog, testler, iletişim, kurumsal |
| Danışan (Giriş Yapmış) | /giris | Aynı sayfalar \+ test arşivi, favoriler, taleplerim, profil |
| Uzman | /uzman/giris | Kendi panel: profil, belgeler, müsaitlik, talepler, blog |
| Admin | /admin/giris | Tam sistem yönetimi |

*💡 Danışan için ayrı /danisan/ URL alanı YOKTUR. Giriş yapan danışan ana siteyi kullanır; ek içerikler koşullu render edilir.*

## **1.3 Temel Değer Önerileri**

* Admin onaylı, sertifikalı uzman profilleri.

* Ücretsiz ön görüşme — ödeme olmadan WhatsApp üzerinden ilk iletişim.

* Şeffaf paket fiyatları (tek noktada: /paketler sayfası).

* Mobil öncelikli, hızlı yüklenen (skeleton) deneyim.

* KVKK uyumlu, güvenli veri işleme.

# **2\. GÜNCEL SİTE HARİTASI (v2.1)**

## **2.1 Ana Site (Herkese Açık)**

| Sayfa | URL | Giriş Yapmış Danışana Ek İçerik |
| :---- | :---- | :---- |
| Ana Sayfa | / | Ücretsiz ön görüşme popup, kişisel test CTA |
| Uzmanlarımız | /uzmanlar | Favori kaydetme ikonu aktif |
| Uzman Detay | /uzmanlar/\[slug\] | Talep formu aktif (anonim için login yönlendirme) |
| Testler | /testler | Önceki sonuçlarım bölümü görünür |
| Test Çöz+Sonuç | /testler/\[slug\] | Sonuç arşivlenir danışana |
| Blog | /blog | — |
| Blog Detay | /blog/\[slug\] | — |
| Paketler | /paketler | 5 adet paket \+ fiyatlar (admin'den çekilir) |
| Hakkımızda | /hakkimizda | — |
| Nasıl Çalışır | /nasil-calisir | — |
| Uzman Başvurusu | /uzman-basvurusu | — |
| İletişim | /iletisim | Tek form \+ konu dropdown |
| Kurumsal | /kurumsal | Kurumsal bilgi \+ form (AYRI SAYFA) |
| SSS | /sss | — |
| KVKK / Yasal | /kvkk vb. | — |

## **2.2 Auth Sayfaları**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Danışan Giriş | /giris | E-posta \+ şifre |
| Danışan Kayıt | /kayit | Ad, Soyad, Telefon, E-posta, Şifre, Şifre Tekrar, KVKK, Bülten |
| Şifremi Unuttum | /sifre-sifirla | E-posta gir → Brevo mail → Link tıkla → Yeni şifre |
| Uzman Giriş | /uzman/giris | Ayrı sayfa, ayrı flow |
| Uzman Kayıt | /uzman/kayit | Ad, Soyad, Telefon, E-posta, Şifre \+ Sertifika PDF \+ CV PDF |

## **2.3 Uzman Paneli**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Dashboard | /uzman/dashboard | Profil durumu, tamamlanma yüzdesi, istatistikler |
| Profil Düzenleme | /uzman/profil | 80-150 kelime tanıtım, anahtar kelimeler, fotoğraf |
| Belgeler | /uzman/belgeler | Sertifika PDF \+ CV PDF yükleme |
| Müsaitlik | /uzman/musaitlik | Takvim seçimi (login'de de sorulur) |
| Gelen Talepler | /uzman/talepler | Danışan form/talepleri |
| Blog | /uzman/blog | Yazı oluşturma, taslak, onay durumu |
| Bildirimler | /uzman/bildirimler | Admin uyarıları \+ sistem bildirimleri |

## **2.4 Admin Paneli**

| Sayfa | URL | Not |
| :---- | :---- | :---- |
| Dashboard | /admin/dashboard | Görev odaklı: bekleyen işler |
| Uzmanlar | /admin/uzmanlar | Liste, aktif/pasif, öncelik skoru |
| Onaylar | /admin/onaylar | Profil \+ blog onayları, reddetme notu zorunlu |
| Paketler & Fiyatlar | /admin/paketler | 5 paketin tümünü yönet |
| Anahtar Kelimeler | /admin/anahtar-kelimeler | Taxonomy yönetimi |
| Müsaitlik | /admin/musaitlik | Genel \+ uzman bazlı takvim, kırmızıya alma |
| Blog Moderasyon | /admin/blog | Onayla/Reddet(not), revize statüsü |
| Yorumlar | /admin/yorumlar | Onayla/Reddet moderation |
| SSS | /admin/sss | Soru-cevap çiftleri ekle/düzenle |
| Kullanıcılar | /admin/kullanicilar | Danışan listesi |
| Bülten | /admin/bulten | Abone listesi (Brevo) |
| Bildirimler | /admin/bildirimler | Uzmana uyarı gönder |
| İletişim Formları | /admin/iletisim-formlari | Gelen form talepleri |
| Sistem Ayarları | /admin/ayarlar | Logo, genel, e-posta şablonları |

# **3\. REVİZE NOTLARI — GÜNCEL & NİHAİ SÜRÜM**

*Kırmızı kart \= v2.1'de değişen/güncellenen madde. Yeşil kart \= v2.0'dan gelen, onaylı madde.*

| \#R01 | Ücretsiz Ön Görüşme Popup Giriş yapan danışana (ilk girişte veya belirli sayfada) popup: 'Ücretsiz ön görüşme hakkınız var\!' → 'WhatsApp ile Başlat' butonu. Anonim ziyaretçiye de ana sayfada gösterilir. Popup kapanabilir. |
| :---: | :---- |

| \#R02 | Test Sonucu Görüntüleme Danışan test tamamlayınca anında sonucu görür: puan özeti \+ grafik \+ uzman önerisi CTA. Giriş yapan danışan için arşive kaydedilir (/testler sayfasında 'Önceki Sonuçlarım' bölümü). |
| :---: | :---- |

| \#R03 | Test Yaptırmak İster misiniz? CTA Ana sayfada ve gerekli sayfalarda 'Kendinizi Tanıyın — Ücretsiz Test Yapın' CTA. /testler sayfasına yönlendirir. |
| :---: | :---- |

| \#R04 | Tek Sayfa Mimarisi — Danışan Panel Yok  🔄 v2.1 DEĞİŞTİ AYRI DANIŞAN PANELİ YOKTUR. Danışan giriş yaptıktan sonra aynı sayfaları görür \+ giriş yapanlar için ek UI katmanları (favoriler ikonu, 'Talep Gönder' aktif, test arşivi, header dropdown). |
| :---: | :---- |

| \#R05 | Skeleton Loading  🔄 v2.1 DEĞİŞTİ Framer Motion sayfa animasyonu KALDIRILDI. Her sayfa/komponent için özel skeleton bileşeni. Shimmer: CSS @keyframes gradient sweep 1.5s infinite. prefers-reduced-motion desteği. |
| :---: | :---- |

| \#R06 | Kurumsal Sayfa — Ayrı URL  🔄 v2.1 DEĞİŞTİ /kurumsal ayrı bir sayfa. Header'da 'Kurumsal' navigasyon linki. İçerik: kurumsal hizmet tanıtımı \+ form (Şirket Adı, Yetkili, E-posta, Telefon, Çalışan Sayısı opsiyonel, Konu dropdown, Mesaj). |
| :---: | :---- |

| \#R07 | Şifre Sıfırlama — Sadece Brevo Mail  🔄 v2.1 DEĞİŞTİ Şifre sıfırlama linki sadece e-posta ile gönderilir. Brevo transactional API. SMS ve WhatsApp kanal seçimi kaldırıldı. Link geçerlilik: 30 dakika. |
| :---: | :---- |

| \#R08 | Uzman Listesinde Fiyat Yok  🔄 v2.1 DEĞİŞTİ Uzman kartında ve detay sayfasında fiyat bilgisi gösterilmez. Fiyatlar yalnızca /paketler sayfasında bulunur. Admin merkezi fiyat yönetimi /paketler'e yansır. |
| :---: | :---- |

| \#R09 | 5 Adet Paket  🔄 v2.1 DEĞİŞTİ Paket sayısı 5'e çıkarıldı. İçerikler (isim, seans sayısı, açıklama) müşteriden alınacak. Tüm paket fiyatları admin '/admin/paketler' ekranından güncellenir, /paketler sayfasına yansır. |
| :---: | :---- |

| \#R10 | İletişim Formu — Tek Form \+ Konu Dropdown  🔄 v2.1 DEĞİŞTİ Harita kaldırıldı. Tek iletişim formu. Konu alanı: Soru Sorun | Randevu Oluşturun | Öneri | Şikayet | Diğer. Seçime göre conditional alanlar gösterilebilir. |
| :---: | :---- |

| \#R11 | Sabit Ücretler \+ Admin Merkezi Fiyat Yönetimi Ücretler sabit. Admin '/admin/paketler' ekranından günceller → tüm siteye (sadece /paketler) yansır. Bireysel uzman fiyatı yok. |
| :---: | :---- |

| \#R12 | Uzman Listesi — Yıldız \+ Anahtar Kelime \+ Biyografi Limiti Uzman kartında yıldız puanı (1-5). Anahtar kelimeler chip olarak gösterilir. Profil biyografisi min 80, maks 150 kelime zorunlu. |
| :---: | :---- |

| \#R13 | Uzman Profili — Canlı Destek Bağlantısı Uzman detay sayfasında 'Canlı Destek' butonu (WhatsApp ikonlu, sağ alt sabit). Tıklayınca WhatsApp Business API ile bağlantı. 'Profili İncele' deniyor → detay sayfasında bu buton belirgin. |
| :---: | :---- |

| \#R14 | Kayıt Formu Alanları Danışan: Ad, Soyad, Telefon No, E-posta, Şifre, Şifre Tekrar, KVKK onayı (zorunlu), Bülten izni (opsiyonel). Uzman: Aynı \+ Sertifika PDF (zorunlu), CV/Özgeçmiş PDF (zorunlu). |
| :---: | :---- |

| \#R15 | Sertifikalar — PDF Yükleme, Danışana Görünür Uzman belgeler sayfasına: Sertifika PDF ve CV/Özgeçmiş PDF yükleme. Uzman detay sayfasında danışanlar belgeleri görüntüler (inline PDF viewer veya indirme linki). |
| :---: | :---- |

| \#R16 | Admin — Anahtar Kelime Yönetimi '/admin/anahtar-kelimeler': ekle, düzenle, sırala, yayınla/gizle. Uzmanlar bu listeden seçim yapar, serbest metin yok. |
| :---: | :---- |

| \#R17 | Yüz Yüze Görüşme Kaldırıldı Hizmet tiplerinden 'Yüz Yüze' tamamen kaldırıldı. Sadece online hizmet. Faz 2'de yeniden değerlendirilebilir. |
| :---: | :---- |

| \#R18 | Admin — Revize Notu ile Red Yazısı Admin profil veya blog reddederken not girişi zorunlu. Uzman panelinde belirgin uyarı: 'Reddedildi: \[Admin Notu\]'. Bildirim çanına da düşer. |
| :---: | :---- |

| \#R19 | Uzman Olarak Giriş Yap Header navigasyonunda ve footer'da 'Uzman Girişi' linki. Ayrı /uzman/giris sayfası, ayrı akış. |
| :---: | :---- |

| \#R20 | Profil Güncelleme → Tekrar Onay Uzman her profil güncellemesinde (fotoğraf, biyografi, belgeler vb.) değişiklikler admin onayına düşer. Onaylanana kadar yayındaki eski versiyon görünür. |
| :---: | :---- |

| \#R21 | 80–150 Kelime Tanıtım Yazısı Profil formunda 'Hakkımda' alanı: min 80, maks 150 kelime. Canlı kelime sayacı. Dışında form gönderilemez. |
| :---: | :---- |

| \#R22 | Uzman Öncelik Skoru Admin '/admin/uzmanlar' ekranında her uzmana 1-100 öncelik skoru. Uzman listesi bu skora göre sıralanır. Eşit skorlarda yıldız ikincil kriter. |
| :---: | :---- |

| \#R23 | Canlı Destek Butonu Tüm sayfalarda sağ alt sabit buton. 'Canlı Destek' adı \+ WhatsApp ikonu. Primary (\#016a59) renk. |
| :---: | :---- |

| \#R24 | Yorum Sistemi \+ Admin Moderasyonu Kullanıcı uzman profilinde yorum bırakır → admin panele düşer → Onayla/Reddet. Onaylanan yorum profilde görünür, yıldız ortalamasına dahil olur. |
| :---: | :---- |

*⚠️ Google Yorumları entegrasyonu (Google My Business API) şimdilik beklemede. Altyapı hazır bırakılır, Faz 2'ye ertelendi.*

| \#R25 | Mobil Uzman Kartı Düzeni Sol üst: fotoğraf (72×72px, yuvarlak). Yanına: ad-soyad \+ unvan. Altına: biyografi özeti (2 satır truncate). En alta: etiket chip'leri (min 2, maks 5). Yıldız \+ 'Profili İncele' butonu. |
| :---: | :---- |

| \#R26 | Etiket Limiti — Min 2, Maks 5 Uzman profil formunda anahtar kelime seçimi: min 2, maks 5\. Form validasyonu zorlar. Kart ve profilde chip olarak gösterilir. |
| :---: | :---- |

| \#R27 | Anlık Kullanıcı Sayacı Uzman listesinde 'Şu an X kişi inceliyor' (85+ formatı gibi olabilir). X: simüle, her 30-90s güncellenen veri. Yeşil nabız animasyonu. |
| :---: | :---- |

| \#R28 | Blog Red — Not Zorunlu \+ Revize Edilebilir Admin blog reddederken not girer. Uzman düzeltip tekrar gönderir → 'Revize Gönderildi' statüsü. |
| :---: | :---- |

| \#R29 | Ekibimiz / Hikayemiz Kaldırıldı Hakkımızda'dan 'Ekibimiz' ve 'Hikayemiz' kaldırıldı. Yerine: 'Bizi diğer platformlardan ayıran özellikler' bölümü. |
| :---: | :---- |

| \#R30 | SSL Sertifikası HTTPS zorunlu, HTTP → HTTPS yönlendirme. Vercel SSL otomatik (Let's Encrypt). |
| :---: | :---- |

| \#R31 | Admin — SSS Yönetimi '/admin/sss': Soru \+ Cevap ekle, düzenle, sırala, yayınla/gizle. Ana sitede /sss. |
| :---: | :---- |

| \#R32 | Uzman Uyarı \+ Popup Bildirim Admin uyarı gönderince uzmanın açık sayfasında anlık popup. Kapatınca bildirim çanında kalır. |
| :---: | :---- |

| \#R33 | Danışan Bülten Listesi \+ KVKK Ayrımı Kayıt formunda ayrı iki onay: 1\) KVKK zorunlu, 2\) Bülten opsiyonel. Bülten listesi '/admin/bulten'. Brevo ile toplu mail. |
| :---: | :---- |

| \#R34 | Logo Site Tasarımına Entegre Logo renk paletiyle uyumlu işlenecek. Favicon, og:image, PWA ikonları hazırlanacak. |
| :---: | :---- |

| \#R35 | Müsaitlik Takvimi Genel takvim (admin kırmızıya alır) \+ uzman bazlı bireysel tablolar. Uzman login'de müsaitliğini seçer. Çift yönlü senkronizasyon. |
| :---: | :---- |

| \#R36 | Nasıl Çalışır — Düzenlenmeli '/nasil-calisir' sayfası yeni akışa (talep gönderme, WhatsApp ön görüşme) göre revize edilecek. |
| :---: | :---- |

| \#R37 | Ücretsiz Ön Görüşme → WhatsApp Tüm 'Ücretsiz Ön Görüşme' butonları WhatsApp Business API'ye yönlendirir. Önceden doldurulmuş mesaj şablonu. Numara admin ayarlarından yönetilir. |
| :---: | :---- |

# **4\. ORTAK KOMPONENT & SKELETON LİSTESİ**

| Komponent | Skeleton | İlgili Revize |
| :---- | :---- | :---- |
| ExpertCard (Desktop) | ExpertCardSkeleton | R12, R22, R08 |
| ExpertCard (Mobil) | ExpertCardSkeleton | R25, R26 |
| StarRating | — | R12 |
| TagChip | — | R26 |
| LiveSupportButton (sabit) | — | R23 |
| FreeMeetingPopup | — | R01, R37 |
| LiveUserCount | — | R27 |
| PackageCard | PackageCardSkeleton | R09, R11 |
| PDFViewer | PDFViewerSkeleton | R15 |
| AdminRedNote | — | R18 |
| NotificationBell | — | R32 |
| AvailabilityGrid | AvailabilityGridSkeleton | R35 |
| CorporateForm | — | R06 |
| ContactForm | — | R10 |
| WordCounter | — | R21 |
| TestResultCard | TestResultSkeleton | R02 |
| UserDropdownMenu | — | R04 |
| BlogCard | BlogCardSkeleton | — |
| ProfilePage | ProfileSkeleton | — |

# **5\. STİTCH & FİGMA EKRAN LİSTESİ**

*Öncelik: P0 \= MVP için zorunlu, P1 \= önemli, P2 \= faydalı. Her ekranın mobil \+ masaüstü varyantı ayrı oluşturulur.*

## **5.1 Ana Site Ekranları**

| Ekran | URL | Prio | Revize |
| :---- | :---- | :---- | :---- |
| Ana Sayfa (Anonim) | / | P0 | R01, R03, R27 |
| Ana Sayfa (Giriş Yapılmış) | / | P0 | R01, R04 |
| Uzman Listesi | /uzmanlar | P0 | R12, R22, R25, R26, R27 |
| Uzman Detay | /uzmanlar/\[slug\] | P0 | R13, R15, R23 |
| Testler | /testler | P0 | R02, R03 |
| Test Çöz \+ Sonuç | /testler/\[slug\] | P0 | R02 |
| Paketler | /paketler | P0 | R09, R11 |
| Hakkımızda | /hakkimizda | P1 | R29 |
| Nasıl Çalışır | /nasil-calisir | P1 | R36 |
| Blog Liste | /blog | P1 | — |
| Blog Detay | /blog/\[slug\] | P1 | — |
| İletişim | /iletisim | P1 | R10 |
| Kurumsal | /kurumsal | P1 | R06 |
| SSS | /sss | P2 | R31 |
| Uzman Başvurusu | /uzman-basvurusu | P1 | R14 |

## **5.2 Auth Ekranları**

| Ekran | URL | Prio | Not |
| :---- | :---- | :---- | :---- |
| Danışan Giriş | /giris | P0 | R04, R07 |
| Danışan Kayıt | /kayit | P0 | R14, R33 |
| Şifremi Unuttum | /sifre-sifirla | P0 | R07 — Brevo mail |
| Uzman Giriş | /uzman/giris | P0 | R19 |
| Uzman Kayıt | /uzman/kayit | P0 | R14 |

## **5.3 Uzman Panel Ekranları**

| Ekran | URL | Prio | Revize |
| :---- | :---- | :---- | :---- |
| Uzman Dashboard | /uzman/dashboard | P0 | R18, R32 |
| Profil Düzenleme | /uzman/profil | P0 | R12, R20, R21 |
| Belgeler | /uzman/belgeler | P0 | R15 |
| Müsaitlik Takvimi | /uzman/musaitlik | P1 | R35 |
| Gelen Talepler | /uzman/talepler | P1 | — |
| Blog Yönetimi | /uzman/blog | P2 | R28 |
| Bildirimler | /uzman/bildirimler | P1 | R32 |

## **5.4 Admin Panel Ekranları**

| Ekran | URL | Prio | Revize |
| :---- | :---- | :---- | :---- |
| Admin Dashboard | /admin/dashboard | P0 | R18 |
| Uzman Listesi | /admin/uzmanlar | P0 | R22 |
| Profil Onayları | /admin/onaylar | P0 | R18, R20 |
| Paketler & Fiyatlar | /admin/paketler | P0 | R09, R11 |
| Anahtar Kelimeler | /admin/anahtar-kelimeler | P0 | R16 |
| Müsaitlik | /admin/musaitlik | P1 | R35 |
| Blog Moderasyon | /admin/blog | P1 | R28 |
| Yorum Moderasyon | /admin/yorumlar | P1 | R24 |
| SSS | /admin/sss | P1 | R31 |
| Kullanıcılar | /admin/kullanicilar | P2 | — |
| Bülten | /admin/bulten | P2 | R33 |
| Bildirim Gönder | /admin/bildirimler | P1 | R32 |
| İletişim Formları | /admin/iletisim-formlari | P2 | — |
| Sistem Ayarları | /admin/ayarlar | P2 | R30, R34 |

# **6\. ÇALIŞMA AKIŞI — STİTCH → FİGMA → KOD**

| Adım | Araç | Yapılacak |
| :---- | :---- | :---- |
| 1 | Stitch | Bu brief \+ site haritasına göre tüm ekranların wireframe'leri oluşturulur. Her ekran notuna revize numarası eklenir (örn: R04, R12). |
| 2 | Figma | Wireframe'ler renk paleti, tipografi ve komponent kurallarıyla yüksek fidelity'e taşınır. Skeleton varyantları da oluşturulur. |
| 3 | Figma | Komponent kütüphanesi: ExpertCard, TagChip, PackageCard, Skeleton'lar, Button varyantları vb. |
| 4 | Next.js | Önce komponentler, sonra sayfalar. Her komponent skeleton'ı ile birlikte yazılır. |
| 5 | NestJS \+ Prisma | API endpoint'leri ve veritabanı şeması. Brevo entegrasyonu, WhatsApp API. |
| 6 | QA | Mobil \+ masaüstü test. KVKK akışları. Skeleton doğrulama. Lighthouse skoru kontrolü. |

*💡 Her Stitch ekranına ve Figma frame'ine ilgili revize numarası (R04, R12 vb.) açıklama olarak eklenir. Bu brief Stitch ve Figma çalışması boyunca açık tutulur.*

# **7\. FAZ PLANI**

## **Faz 1 — Aktif MVP (Tüm Revizeler Dahil)**

R01'den R37'ye tüm revize notları Faz 1 kapsamındadır. Ayrı danışan paneli yok, skeleton loading, kurumsal sayfa, 5 paket, Brevo mail, tek iletişim formu.

## **Faz 2 — İleride Eklenecek Modüller**

| Modül | Açıklama |
| :---- | :---- |
| Takvim & Randevu | Uzman müsaitlik \+ danışan saat seçimi (Faz 1 müsaitlik altyapısı üzerine) |
| Online Ödeme | İyzico/Stripe/PayTR, e-fatura |
| Video Görüşme | Zoom API / Jitsi entegrasyonu |
| Google Yorumları | Google My Business API entegrasyonu |
| Soru-Cevap | Danışan sorar, admin cevaplar (R32 tam aktivasyon) |
| SMS Entegrasyonu | Hatırlatma ve bildirim |

*Case Brief v2.1  |  Psikolojik Danışmanlık Platformu  |  Son Revize — Stitch, Figma ve Kod için Daima Açık Tut*