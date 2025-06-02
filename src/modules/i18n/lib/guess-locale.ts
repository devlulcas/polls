import { DEFAULT_LOCALE, LOCALES, Locale } from "../constants/i18n";
import { isLocale } from "./is-locale";

export function guessLocale(headers: Headers) {
    const locale = headers.get('accept-language')?.split(',')[0];
    return locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
}