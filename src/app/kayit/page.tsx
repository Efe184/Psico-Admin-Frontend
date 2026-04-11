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
  registerDemoUser,
  setAdminSessionCookies,
} from "@/lib/demo-auth";

export default function KayitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    const result = registerDemoUser({ name, email, password });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Kayıt oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz.");
    router.push("/giris");
  };

  const handleRegisterAndEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    const result = registerDemoUser({ name, email, password });
    if (!result.ok) {
      setLoading(false);
      toast.error(result.message);
      return;
    }
    setAdminSessionCookies("user");
    setLoading(false);
    toast.success("Hesap oluşturuldu, yönlendiriliyorsunuz.");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-lg">
        <CardHeader>
          <CardTitle>Kayıt ol</CardTitle>
          <CardDescription>
            Demo: bilgiler yalnızca bu tarayıcıda saklanır. Üretimde backend
            kullanılacaktır.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Ad soyad</Label>
              <Input
                id="reg-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsteğe bağlı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">E-posta</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-pass">Şifre</Label>
              <Input
                id="reg-pass"
                type="password"
                autoComplete="new-password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 4 karakter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-pass2">Şifre tekrar</Label>
              <Input
                id="reg-pass2"
                type="password"
                autoComplete="new-password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full transition-colors hover:opacity-95 active:scale-[0.99]"
              disabled={loading}
            >
              Kayıt ol ve girişe git
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full transition-colors hover:bg-muted/80 active:scale-[0.99]"
              disabled={loading}
              onClick={handleRegisterAndEnter}
            >
              Kayıt ol ve direkt içeri gir
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Zaten hesabın var mı?{" "}
              <Link
                href="/giris"
                className="font-medium text-[#3178C6] underline-offset-4 hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
