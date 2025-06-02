"use client";

import { useState } from "react";
import { useTransition } from "react";
import { LOCALES, DEFAULT_LOCALE, Locale } from "../constants/i18n";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { setLocalePreference } from "../actions/set-locale-preference";

export function LocaleSelect() {
  const [pending, startTransition] = useTransition();
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  const handleLocaleChange = (locale: Locale) => {
    setLocale(locale);
    startTransition(() => {
      setLocalePreference(locale);
    });
  };

  return (
    <ToggleGroup
      type="single"
      defaultValue={locale}
      onValueChange={handleLocaleChange}
    >
      {LOCALES.options.map((locale) => (
        <ToggleGroupItem
          key={locale}
          value={locale}
          disabled={pending}
          title={LOCALES.labels[locale]}
        >
          {LOCALES.icons[locale]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
