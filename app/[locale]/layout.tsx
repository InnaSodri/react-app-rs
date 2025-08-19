import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {getMessages} from 'next-intl/server';
import {isLocale} from '@/i18n/routing';
import Providers from '@/app/Providers';
import IntlProviderClient from '@/components/IntlProviderClient';
import '@/components/styles/variables.css';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  const {locale} = params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages({locale});

  return (
    <html lang={locale}>
      <body>
        <Providers>
          <IntlProviderClient locale={locale} messages={messages}>
            {children}
          </IntlProviderClient>
        </Providers>
      </body>
    </html>
  );
}
