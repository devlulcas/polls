export const trustedSites = [
  "amazon.com.br",
  "mercadolivre.com.br",
  "shopee.com.br",
  "casasbahia.com.br",
];

/**
 * Checks if a URL is from a trusted site
 * @param url URL to check
 * @returns boolean indicating if the URL is trusted
 */
export function isTrustedSite(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    return trustedSites.some(
      (site) => hostname === site || hostname.endsWith(`.${site}`)
    );
  } catch (error) {
    return false;
  }
}
