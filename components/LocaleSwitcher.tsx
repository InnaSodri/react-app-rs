'use client';
import {usePathname, useRouter, useSearchParams} from '@/navigation';
import {useLocale} from 'next-intl';
import type {AppPathname} from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname() as AppPathname;
  const sp = useSearchParams();

  const change = (next: string) =>
    router.replace(
      {pathname, query: Object.fromEntries(sp) as Record<string, string>},
      {locale: next}
    );

  return (
    <select value={locale} onChange={(e) => change(e.target.value)}>
      <option value="en">English</option>
      <option value="he">עברית</option>
      <option value="ru">Русский</option>
    </select>
  );
}
