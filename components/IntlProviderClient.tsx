'use client';

import {ReactNode} from 'react';
import {NextIntlClientProvider, IntlError, IntlErrorCode} from 'next-intl';
import type {AbstractIntlMessages} from 'next-intl';

export default function IntlProviderClient({
  locale,
  messages,
  children
}: {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Jerusalem"
      onError={(err: IntlError) => {
        if (err.code === IntlErrorCode.MISSING_MESSAGE) return;
        console.error(err);
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
