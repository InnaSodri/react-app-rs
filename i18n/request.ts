import {getRequestConfig} from 'next-intl/server'
import {routing, isLocale} from '@/i18n/routing'

export default getRequestConfig(async ({locale}) => {
  const l = isLocale(locale ?? '') ? (locale as typeof routing.locales[number]) : routing.defaultLocale
  return {
    locale: l,
    messages: (await import(`../messages/${l}.json`)).default
  }
})