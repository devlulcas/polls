"use client";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const t = useTranslations("theme.themeSwitch");
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      aria-label={t("ariaLabel")}
      checked={theme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
