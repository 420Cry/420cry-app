'use client'

import { JSX } from 'react'
import Image from 'next/image'
import { LanguageChangeButton } from '@/components'
import { CryApplicationLogo } from '@/assets'

const TwoFactorHeader = (): JSX.Element => {
  return (
    <div className="flex justify-between items-center flex-col sm:flex-row sm:items-center px-12 py-6">
      <Image
        src={CryApplicationLogo}
        alt="dark mode logo"
        width={143}
        height={58}
        className="cursor-pointer"
        priority
      />
      <div className="flex flex-col gap-12 sm:flex-row sm:items-center mt-6 sm:mt-0">
        <LanguageChangeButton />
      </div>
    </div>
  )
}

export default TwoFactorHeader
