import { Locale, LOCALES } from "../constants/i18n";

export function isLocale(value: string): value is Locale {
    return LOCALES.options.includes(value as Locale);
}