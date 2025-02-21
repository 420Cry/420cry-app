import 'server-only'
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const localeFromHeaders =
    (await headers()).get('accept-language')?.split(',')[0] || 'en'
  // Check if the locale is supported (en or vi), otherwise fall back to en
  const userLocale = (await cookies()).get('locale')?.value || localeFromHeaders
  const baseLocale = ['en', 'vi'].includes(userLocale.split('-')[0])
    ? userLocale.split('-')[0]
    : 'en'
  const messages = (await import(`../messages/${baseLocale}.json`)).default

  return {
    locale: baseLocale,
    messages,
  }
})
