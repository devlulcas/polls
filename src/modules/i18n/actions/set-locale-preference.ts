import { cookies } from "next/headers";
import { Locale, LOCALE_COOKIE_NAME } from "../constants/i18n";

export async function setLocalePreference(locale: Locale) {
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE_NAME, locale);
}