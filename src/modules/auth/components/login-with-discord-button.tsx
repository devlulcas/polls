"use client";

import { Button } from "@/components/ui/button";
import { signInWithDiscord } from "@/modules/supabase/lib/auth";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/modules/user/hooks/use-current-user-query";

export function LoginWithDiscordButton({ className }: { className?: string }) {
  const tc = useTranslations("common");
  const t = useTranslations("auth.loginWithDiscordButton");
  const [pending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  const handleLogin = () =>
    startTransition(async () => {
      await signInWithDiscord();
      queryClient.invalidateQueries(currentUserQueryOptions());
    });

  return (
    <Button
      onClick={handleLogin}
      disabled={pending}
      variant="discord"
      className={cn("h-11 w-full", className)}
    >
      <SiDiscord className="mr-2 h-4 w-4" />
      {pending ? tc("loader.ariaLabel") : t("label")}
    </Button>
  );
}
