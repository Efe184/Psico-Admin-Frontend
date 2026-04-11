"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GirisPage() {
  const [msg, setMsg] = useState<string | null>(null);

  const devSimulateLogin = () => {
    document.cookie = `${"accessToken"}=dev; path=/; max-age=86400`;
    document.cookie = `${"userRole"}=admin; path=/; max-age=86400`;
    setMsg("Çerezler ayarlandı. Yönlendiriliyorsunuz.");
    window.location.assign("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle>Psikolog yönetim girişi</CardTitle>
          <CardDescription>
            Üretimde kimlik doğrulama backend ile bağlanacak. Middleware{" "}
            <code className="text-xs">accessToken</code> ve{" "}
            <code className="text-xs">userRole=admin</code> çerezlerini bekler.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Backend hazır olduğunda bu sayfa e-posta / şifre formu ve oturum
            oluşturma ile değiştirilecek.
          </p>
          {msg ? <p className="text-foreground">{msg}</p> : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {process.env.NODE_ENV === "development" ? (
            <Button
              type="button"
              className="w-full"
              variant="secondary"
              onClick={devSimulateLogin}
            >
              Geliştirici: admin oturumu simüle et
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
