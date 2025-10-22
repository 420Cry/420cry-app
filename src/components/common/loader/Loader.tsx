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
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Loading content */}
      <div className="relative flex flex-col items-center gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-8 py-8 rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20">
        {/* Spinner with enhanced styling */}
        <div className="relative">
          <SpinnerIcon />
          {/* Glow effect around spinner */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg animate-pulse"></div>
        </div>

        {/* Loading message with better typography */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {displayMessage}
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
