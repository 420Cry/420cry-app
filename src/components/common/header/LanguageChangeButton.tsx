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
    <div className="flex items-center justify-center gap-2">
      <span
        className={`font-semibold text-sm transition-colors duration-200 ${isEN ? 'text-white' : 'text-gray-400'}`}
      >
        EN
      </span>
      <button
        onClick={changeLanguage}
        className="relative flex items-center w-12 h-6 rounded-full bg-gray-700 border border-gray-600 cursor-pointer transition-all duration-200 hover:bg-gray-600"
      >
        <span
          className={`absolute w-5 h-5 rounded-full bg-blue-500 left-0.5 transition-transform duration-200 shadow-sm ${
            isEN ? 'translate-x-0' : 'translate-x-6'
          }`}
        />
      </button>
      <span
        className={`font-semibold text-sm transition-colors duration-200 ${isEN ? 'text-gray-400' : 'text-white'}`}
      >
        VN
      </span>
    </div>
  )
}

export default LanguageChangeButton
