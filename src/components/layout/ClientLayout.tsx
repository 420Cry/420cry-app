'use client'

import { ILocale } from '@/types'
import { IntlProvider } from 'next-intl'
import { JSX, ReactNode } from 'react'
import { ToastBar, Toaster, toast } from 'react-hot-toast'

interface ClientLayoutProps {
  children: ReactNode
  localeData: ILocale
}

const ClientLayout = ({
  children,
  localeData,
}: ClientLayoutProps): JSX.Element => {
  return (
    <IntlProvider
      messages={localeData.messages}
      locale={localeData.locale}
      timeZone={localeData.timeZone}
    >
      <Toaster
        toastOptions={{
          className: 'w-full',
          duration: 5000,
          position: 'bottom-right' as const,
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ message }) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Status indicator */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.type === 'success'
                        ? 'bg-green-400 shadow-green-400/50'
                        : t.type === 'error'
                          ? 'bg-red-400 shadow-red-400/50'
                          : 'bg-blue-400 shadow-blue-400/50'
                    } shadow-lg animate-pulse`}
                  />

                  {/* Message */}
                  <span className="text-white text-sm font-medium leading-relaxed flex-1">
                    {message}
                  </span>
                </div>

                {/* Dismiss button */}
                {t.type !== 'loading' && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-3 flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 flex items-center justify-center group"
                    aria-label="Dismiss notification"
                  >
                    <svg
                      className="w-3 h-3 transition-transform duration-200 group-hover:scale-110"
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
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      {children}
    </IntlProvider>
  )
}

export default ClientLayout
