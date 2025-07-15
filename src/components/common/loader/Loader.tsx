'use client'

import { SpinnerIcon } from '@420cry/420cry-lib'
import { useTranslations } from 'next-intl'
import { JSX, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface LoadingModalProps {
  show: boolean
  message?: string
}

export default function Loader({
  show,
  message,
}: LoadingModalProps): JSX.Element | null {
  const t = useTranslations()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !show) return null

  const displayMessage = message || t('app.common.loading')

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-4 bg-transparent px-6 py-2 rounded-lg">
        <SpinnerIcon />
        <p className="text-sm text-blue-600 text-center pointer-events-auto">
          {displayMessage}
        </p>
      </div>
    </div>,
    document.body,
  )
}
