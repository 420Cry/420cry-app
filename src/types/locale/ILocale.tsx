import { AbstractIntlMessages } from 'next-intl'

export interface ILocale {
  locale: string
  messages: AbstractIntlMessages
  timeZone: string
}
