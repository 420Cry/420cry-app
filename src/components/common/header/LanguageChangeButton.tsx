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

    setIsEN(newIsEN)

    const response = await localeService.changeLanguage(locale)
    showToast(response.isSuccess, t(response.message))
    router.refresh()
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <span
        className={`font-bold text-xs sm:text-sm ${isEN ? 'text-white' : 'text-gray-400'}`}
      >
        EN
      </span>
      <button
        onClick={changeLanguage}
        className="relative flex items-center w-12 h-6 sm:w-24 sm:h-10 rounded-full bg-primary cursor-pointer transition-all duration-200"
      >
        <span
          className={`absolute w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-white left-0.5 sm:left-0.5 transition-transform duration-200 ${
            isEN ? 'translate-x-0' : 'translate-x-6 sm:translate-x-14'
          }`}
        />
      </button>
      <span
        className={`font-bold text-xs sm:text-sm ${isEN ? 'text-gray-400' : 'text-white'}`}
      >
        VN
      </span>
    </div>
  )
}

export default LanguageChangeButton
