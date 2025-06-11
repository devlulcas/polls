"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/modules/auth/components/login-form";
import { LoginWithDiscordButton } from "@/modules/auth/components/login-with-discord-button";
import { useTranslations } from "next-intl";
import { RedirectWarning } from "@/modules/auth/components/redirect-warning";

export default function LoginPage() {
  const t = useTranslations("auth.loginPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/red-clouds.webp')] bg-repeat bg-auto p-4 bg-center before:absolute before:backdrop-blur-sm before:w-full before:h-full">
      <RedirectWarning />
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-background backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-3">
            <CardTitle className="text-5xl font-bold tracking-tight font-serif">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("or")}
                </span>
              </div>
            </div>

            <LoginWithDiscordButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
