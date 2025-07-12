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

  const buttonClassname = `absolute w-10 h-10 rounded-full top-0 left-0 bg-white duration-200 ease-in-out ${isEN ? 'translate-x-0' : 'translate-x-14'}`

  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`${isEN ? 'text-white' : 'text-gray-400'} font-bold`}>
        VN
      </span>
      <button
        onClick={changeLanguage}
        className="relative w-24 h-10 rounded-full bg-primary cursor-pointer"
      >
        <span className={buttonClassname}></span>
      </button>
      <span className={`${isEN ? 'text-gray-400' : 'text-white'} font-bold`}>
        EN
      </span>
    </div>
  )
}

export default LanguageChangeButton
