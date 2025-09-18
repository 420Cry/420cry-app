import { LOCALE_COOKIE_API, RequestService } from '@/lib'
import { ILocaleLanguage, IResponse } from '@/types'

export const localeService = {
  changeLanguage: async (locale: string): Promise<IResponse> => {
    if (locale !== 'en' && locale !== 'vi') {
      return {
        isSuccess: false,
        message: 'app.alertTitle.invalidLanguage',
      }
    }

    try {
      const payload: ILocaleLanguage = locale
      const response = await RequestService.nativeFetchPost<
        ILocaleLanguage,
        IResponse
      >(LOCALE_COOKIE_API, payload)
      return response
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  },
}
