"use client";

import Link from "next/link";
import UserNav from "./user-nav";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("layout");

  return (
    <header className="w-full p-1 h-[var(--h-header)] sticky top-0 inset-x-0 flex items-center justify-center">
      <nav className="container border rounded-full h-full w-full p-1 flex items-center justify-between bg-gradient-to-b from-card via-sidebar-accent/70 to-sidebar-accent/60">
        <Link
          href="/"
          className="text-xl font-bold font-serif flex items-center gap-1 ps-4"
        >
          {t("navbar.title")}
        </Link>

        <UserNav />
      </nav>
    </header>
  );
}
