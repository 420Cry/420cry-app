import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const localeFromHeaders =
    (await headers()).get('accept-language')?.split(',')[0] || 'en'
  const userLocale = (await cookies()).get('locale')?.value || localeFromHeaders
  console.log('Determined Locale:', userLocale)

  const baseLocale = userLocale.split('-')[0]
  const messages = (await import(`../../messages/${baseLocale}.json`)).default

  return {
    locale: baseLocale,
    messages,
  }
})
