import { ContentPublishForm } from "@/components/admin/content-publish-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function IcerikYayinlaPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <Card className="rounded-lg border border-border shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            İçerik yayınla
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Oluşturduğunuz içerik, onaylandıktan sonra kullanıcılar tarafından
            görüntülenebilecek.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentPublishForm embedInPage />
        </CardContent>
      </Card>
    </div>
  );
}
