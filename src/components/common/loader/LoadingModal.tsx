'use client'

import { useTranslations } from 'next-intl'
import { ReactElement, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface LoadingModalProps {
  show: boolean
  message?: string
}

export default function LoadingModal({
  show,
  message,
}: LoadingModalProps): ReactElement | null {
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
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
        <p className="text-sm text-blue-600 text-center pointer-events-auto">
          {displayMessage}
        </p>
      </div>
    </div>,
    document.body,
  )
}
