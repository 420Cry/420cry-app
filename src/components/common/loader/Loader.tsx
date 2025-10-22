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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modern backdrop with gradient and blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/20 to-purple-900/40 backdrop-blur-md"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Modern loading card */}
      <div className="relative flex flex-col items-center gap-8 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl px-12 py-12 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Modern spinner container */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-spin"
            style={{ animationDuration: '3s' }}
          ></div>

          {/* Spinner with modern styling */}
          <div className="relative p-4 bg-white/5 dark:bg-gray-800/5 rounded-full border border-white/10 dark:border-gray-700/20">
            <SpinnerIcon className="text-blue-500 dark:text-blue-400" />
          </div>

          {/* Inner pulse effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        </div>

        {/* Modern loading message */}
        <div className="text-center space-y-3">
          <p className="text-xl font-medium text-gray-800 dark:text-gray-100 tracking-wide">
            {displayMessage}
          </p>

          {/* Modern animated dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.15s' }}
            ></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.3s' }}
            ></div>
          </div>

          {/* Subtle progress bar */}
          <div className="w-24 h-1 bg-gray-200/30 dark:bg-gray-700/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
