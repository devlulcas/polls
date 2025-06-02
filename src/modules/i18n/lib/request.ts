import {getRequestConfig} from 'next-intl/server';
import { getLocalePreference } from './get-locale-preference';
 
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getLocalePreference();
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});