export const LOCALES = {
    options: ['en-US', 'pt-BR'] as const,
    labels: {
        'en-US': 'English',
        'pt-BR': 'Português',
    },
    icons: {
        'en-US': '🇺🇸',
        'pt-BR': '🇧🇷',
    }
} as const;

export type Locale = (typeof LOCALES.options)[number];

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';