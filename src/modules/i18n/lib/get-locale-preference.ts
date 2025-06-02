import { cookies } from "next/headers";
import { DEFAULT_LOCALE, Locale, LOCALE_COOKIE_NAME } from "../constants/i18n";
import { isLocale } from "./is-locale";

export async function getLocalePreference() {
    const cookieStore = await cookies();
    const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    return locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
}