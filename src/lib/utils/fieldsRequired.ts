import { showToast } from '../notifications/showToast'
import { useTranslations } from 'next-intl'

type TFunction = ReturnType<typeof useTranslations>

export const fieldsRequired = (formData: FormData, t: TFunction): boolean => {
  if ([...formData.values()].some((value) => !value)) {
    showToast(false, t('app.alertTitle.allfieldsAreRequired'))
    return false
  }

  return true
}
