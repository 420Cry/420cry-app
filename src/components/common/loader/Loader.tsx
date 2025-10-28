'use client'

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
      {/* Transparent backdrop with subtle blur */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-sm"></div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Outer hexagon ring */}
        <div className="absolute inset-0">
          <div
            className="w-40 h-40 rotate-animation"
            style={{
              background: `
                conic-gradient(from 0deg, 
                  transparent 0deg, 
                  rgba(251, 191, 36, 0.3) 60deg,
                  rgba(249, 115, 22, 0.3) 120deg,
                  rgba(251, 191, 36, 0.3) 180deg,
                  transparent 240deg,
                  transparent 360deg
                )
              `,
              clipPath:
                'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              animation: 'spin 3s linear infinite',
            }}
          ></div>
        </div>

        {/* Middle rotating crypto symbols */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Animated rings */}
          <div
            className="absolute inset-0 border-4 border-transparent border-t-yellow-500/30 border-r-orange-500/30 rounded-full animate-spin"
            style={{ animationDuration: '2s' }}
          ></div>
          <div
            className="absolute inset-0 border-4 border-transparent border-b-yellow-500/20 border-l-orange-500/20 rounded-full animate-spin"
            style={{ animationDuration: '3s', animationDirection: 'reverse' }}
          ></div>

          {/* Central crypto hexagon */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center">
            <div
              className="w-full h-full relative"
              style={{
                background:
                  'linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(249, 115, 22, 0.8))',
                clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              <div
                className="absolute inset-2 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                  clipPath:
                    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <span className="text-white font-bold text-2xl animate-pulse">
                  ₿
                </span>
              </div>
            </div>

            {/* Outer glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-orange-500/40 to-yellow-400/40 rounded-full animate-pulse"
              style={{ filter: 'blur(12px)', zIndex: -1 }}
            ></div>
          </div>
        </div>

        {/* Floating particles around the center */}
        <div className="absolute inset-0 -z-10">
          {[...Array(6)].map((_, i) => {
            const angle = (i * 360) / 6
            const radius = 60
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-500/60 rounded-full"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  animation: 'orbit 3s linear infinite',
                  animationDelay: `${i * 0.3}s`,
                }}
              ></div>
            )
          })}
        </div>

        {/* Blockchain visualization */}
        <div className="flex items-center gap-1.5 mt-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="relative w-8 h-8"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Hexagon block */}
              <div
                className="w-full h-full"
                style={{
                  background:
                    i % 2 === 0
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(249, 115, 22, 0.3))'
                      : 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(251, 191, 36, 0.3))',
                  clipPath:
                    'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  animation: 'block-pulse 1.5s ease-in-out infinite',
                }}
              ></div>
              {/* Connecting line (except last) */}
              {i < 6 && (
                <div
                  className="absolute top-1/2 left-full w-2 h-0.5 bg-yellow-500/40 animate-pulse"
                  style={{ transform: 'translateY(-50%)' }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Loading message with crypto styling */}
        <div className="text-center space-y-4 mt-4">
          <p className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            {displayMessage}
          </p>

          {/* Animated progress indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-gradient-to-t from-yellow-500/50 to-orange-600/50 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${8 + (i % 2 === 0 ? 4 : 0)}px`,
                }}
              ></div>
            ))}
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span>Syncing</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.3s' }}
              ></span>
              <span>Verified</span>
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate-animation {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(249, 115, 22, 0.6);
          }
        }
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
            opacity: 0.3;
          }
        }
        @keyframes block-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>,
    document.body,
  )
}
