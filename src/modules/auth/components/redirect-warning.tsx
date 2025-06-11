"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function RedirectWarning() {
  const searchParams = useSearchParams();
  const t = useTranslations("auth.redirectReasons");
  const reason = searchParams.get("reason");

  if (!reason) return null;

  return (
    <p
      className="bg-yellow-50 border-yellow-400 p-4 rounded-md rounded-t-none shadow-lg fixed top-0 left-1/2 -translate-x-1/2 z-50 text-sm text-yellow-700"
      aria-live="polite"
      aria-atomic="true"
    >
      {t(reason)}
    </p>
  );
}
