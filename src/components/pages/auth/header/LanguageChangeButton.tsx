'use client'
import { useLanguageStore } from '@/store'
import { JSX, useEffect, useState } from 'react'

const LanguageChangeButton = (): JSX.Element => {
  const [isEN, setIsEN] = useState(true)

  const changeLanguage = () => {
    setIsEN((isEN) => !isEN)
  }

  const languageState = useLanguageStore((state) => state.languageState)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  useEffect(() => {
    if (!isEN) {
      setLanguage('VN')
      return
    } else {
      setLanguage('EN')
    }
  }, [isEN, setLanguage])

  console.log(languageState)

  return (
    <>
      <div className="relative w-24 h-10 rounded-full bg-primary">
        <button
          className="
        absolute w-10 h-10 rounded-full top-0 bg-white"
          onClick={changeLanguage}
        ></button>
      </div>
    </>
  )
}

export default LanguageChangeButton
