export const routing = {
  locales: ['en', 'he', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/about': '/about'
  }
} as const;

export type AppPathname = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const isLocale = (l: string): l is Locale =>
  (routing.locales as readonly string[]).includes(l);
