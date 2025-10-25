'use client'
import { localeService, showToast } from '@/lib'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect, JSX } from 'react'

const LanguageChangeButton = (): JSX.Element => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const lang =
      document.cookie
        .split(';')
        .find((row) => row.trim().startsWith('locale='))
        ?.split('=')[1] || 'en'
    setLanguage(lang)
  }, [])

  const t = useTranslations()
  const router = useRouter()

  const [isEN, setIsEN] = useState(language === 'en')

  useEffect(() => {
    setIsEN(language === 'en')
  }, [language])

  const changeLanguage = async () => {
    const newIsEN = !isEN
    const locale = newIsEN ? 'en' : 'vi'

    // Update UI immediately for instant feedback
    setIsEN(newIsEN)
    setLanguage(locale)

    // Make API call in background
    try {
      const response = await localeService.changeLanguage(locale)
      if (response.isSuccess) {
        // Only refresh if the API call was successful
        router.refresh()
      } else {
        // Revert UI state if API call failed
        setIsEN(!newIsEN)
        setLanguage(newIsEN ? 'vi' : 'en')
        showToast(false, t(response.message))
      }
    } catch (error) {
      // Revert UI state if API call failed
      setIsEN(!newIsEN)
      setLanguage(newIsEN ? 'vi' : 'en')
      showToast(false, t('app.alertTitle.somethingWentWrong'))
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={`font-semibold text-sm transition-colors duration-300 ease-in-out ${isEN ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
      >
        EN
      </span>
      <button
        onClick={changeLanguage}
        className="relative flex items-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <span
          className={`absolute w-5 h-5 rounded-full bg-blue-500 left-0.5 transition-all duration-300 ease-in-out shadow-sm ${
            isEN ? 'translate-x-0' : 'translate-x-6'
          }`}
        />
      </button>
      <span
        className={`font-semibold text-sm transition-colors duration-300 ease-in-out ${isEN ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
      >
        VN
      </span>
    </div>
  )
}

export default LanguageChangeButton
