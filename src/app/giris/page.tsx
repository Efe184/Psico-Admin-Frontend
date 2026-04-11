"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  setAdminSessionCookies,
  verifyDemoLogin,
} from "@/lib/demo-auth";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = verifyDemoLogin(email, password);
    setLoading(false);
    if (!user) {
      toast.error("E-posta veya şifre hatalı. Kayıt oldunuz mu?");
      return;
    }
    setAdminSessionCookies("user");
    toast.success(`Hoş geldiniz, ${user.name}`);
    router.push("/dashboard");
  };

  const handleDemoLogin = () => {
    setAdminSessionCookies("demo");
    toast.success("Demo oturumu açıldı.");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardHeader>
          <CardTitle>Psikolog yönetim girişi</CardTitle>
          <CardDescription>
            Kayıtlı hesabınızla giriş yapın veya demo ile hemen panele geçin.
            Oturum açıkken bu sayfaya yönlendirilmezsiniz — panele dönmek için{" "}
            <Link
              href="/giris?cikis=1"
              className="font-medium text-[#3178C6] underline-offset-4 hover:underline"
            >
              çıkış yapın
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">E-posta</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-pass">Şifre</Label>
              <Input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full transition-colors hover:opacity-95 active:scale-[0.99]"
              disabled={loading}
            >
              Giriş yap
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full transition-colors hover:bg-muted/80 active:scale-[0.99]"
              onClick={handleDemoLogin}
            >
              Demo giriş (şifresiz, direkt panele)
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Hesabın yok mu?{" "}
              <Link
                href="/kayit"
                className="font-medium text-[#3178C6] underline-offset-4 hover:underline"
              >
                Kayıt ol
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
