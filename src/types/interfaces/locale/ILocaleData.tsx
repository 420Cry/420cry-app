import { AbstractIntlMessages } from 'next-intl'

export interface ILocaleData {
  locale: string
  messages: AbstractIntlMessages
  timeZone: string
}
