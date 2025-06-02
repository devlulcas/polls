"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/modules/supabase/lib/auth";
import { useTranslations } from "next-intl";
import { OutdentIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/modules/user/hooks/use-current-user-query";

export function LogoutButton(
  props: Omit<React.ComponentProps<typeof Button>, "onClick" | "disabled">
) {
  const t = useTranslations("auth.logoutButton");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleLogout = () =>
    startTransition(async () => {
      await signOut();
      queryClient.invalidateQueries(currentUserQueryOptions());
      router.push("/");
    });

  return (
    <Button {...props} onClick={handleLogout} disabled={pending}>
      {t("label")}
    </Button>
  );
}
