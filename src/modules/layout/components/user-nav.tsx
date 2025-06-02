"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { LoginWithDiscordButton } from "@/modules/auth/components/login-with-discord-button";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { useQuery } from "@tanstack/react-query";
import { currentUserQueryOptions } from "@/modules/user/hooks/use-current-user-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon, VoteIcon } from "lucide-react";

export default function UserNav() {
  const t = useTranslations("layout.userNav.userMenu");
  const query = useQuery(currentUserQueryOptions());

  const getUserInitials = () => {
    if (!query.data) return "?";

    const name =
      query.data.user_metadata?.full_name ||
      query.data.user_metadata?.name ||
      query.data.email ||
      "?";

    return name.charAt(0).toUpperCase();
  };

  if (query.isLoading) {
    return <Skeleton className="rounded-full w-[225px] h-10 mr-1" />;
  }

  if (query.error || !query.data) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-sm text-muted-foreground">
          {t("loginWithEmail")}
        </Link>
        {t("or")}
        <LoginWithDiscordButton className="rounded-full w-fit gap-1 shadow h-10 mr-1" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 font-serif lowercase font-semibold"
      >
        {t("dashboard")}
      </Link>
      <Link
        href="/dashboard/polls/create"
        className="flex items-center gap-1 font-serif lowercase font-semibold text-special-3"
      >
        {t("createPoll")}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer h-10 w-10">
            <AvatarImage
              src={query.data.user_metadata?.avatar_url}
              alt={query.data.user_metadata?.name}
            />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="w-full">
              {t("dashboard")} <VoteIcon />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/polls/create" className="w-full">
              {t("createPoll")} <PlusIcon />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <LogoutButton variant="ghost" className="w-full rounded-t" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
