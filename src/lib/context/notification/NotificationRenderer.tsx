'use client'

import { JSX, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNotification } from './NotificationContext'

export function NotificationRenderer(): JSX.Element | null {
  const { notifications, removeNotification } = useNotification()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'error':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'warning':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )
      case 'info':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          message: 'text-green-700 dark:text-green-200',
          closeHover: 'hover:bg-green-100 dark:hover:bg-green-800/50',
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          message: 'text-red-700 dark:text-red-200',
          closeHover: 'hover:bg-red-100 dark:hover:bg-red-800/50',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100',
          message: 'text-yellow-700 dark:text-yellow-200',
          closeHover: 'hover:bg-yellow-100 dark:hover:bg-yellow-800/50',
        }
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          message: 'text-blue-700 dark:text-blue-200',
          closeHover: 'hover:bg-blue-100 dark:hover:bg-blue-800/50',
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          message: 'text-gray-700 dark:text-gray-200',
          closeHover: 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
        }
    }
  }

  if (notifications.length === 0) return null

  return createPortal(
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 min-w-[320px] max-w-md pointer-events-auto">
        {notifications.map((notification) => {
          const colors = getColors(notification.type)
          return (
            <div
              key={notification.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-2 fade-in duration-300 backdrop-blur-xl`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${colors.icon}`}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-bold ${colors.title} mb-1 leading-tight`}
                  >
                    {notification.title}
                  </h3>
                  <p
                    className={`text-sm ${colors.message} leading-snug break-words`}
                  >
                    {notification.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className={`flex-shrink-0 ${colors.icon} ${colors.closeHover} rounded-lg p-1 transition-colors duration-200`}
                  aria-label="Close notification"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}
