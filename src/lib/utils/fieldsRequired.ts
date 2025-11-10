import { showToast } from '@/lib'
import { useTranslations } from 'next-intl'

type TFunction = ReturnType<typeof useTranslations>

export const fieldsRequired = (formData: FormData, t: TFunction): boolean => {
  if ([...formData.values()].some((value) => !value)) {
    showToast(false, t('app.messages.error.allfieldsAreRequired'))
    return false
  }

  return true
}
