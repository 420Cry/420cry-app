'use client'

import { useTranslations } from 'next-intl'
import { JSX } from 'react'

export default function FearAndGreedHistoricalSkeleton({
  className = '',
}: {
  className?: string
}): JSX.Element {
  const t = useTranslations()

  return (
    <div className={`relative w-full ${className}`}>
      {/* Modern Trading Card Container */}
      <div className="bg-gray-950 rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-900 p-6 text-white border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {t('indicator.fearAndGreed.title')}
              </h2>
              <p className="text-gray-400 text-sm">
                {t('indicator.fearAndGreed.chartAnalysis')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-600/50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-400">
                  {t('indicator.fearAndGreed.loading')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-900 p-4 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-300">
                {t('indicator.fearAndGreed.historical.filterTitle')}:
              </span>
              <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1.5 w-24 h-8 animate-pulse"></div>
            </div>

            {/* Skeleton Legend */}
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-600 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-950 p-6">
          <div className="relative min-h-[400px] md:h-[500px]">
            {/* Skeleton Chart Area */}
            <div className="w-full h-full bg-gray-900/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
              <div className="text-center space-y-4">
                {/* Skeleton Chart Lines */}
                <div className="space-y-2">
                  <div className="h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full animate-pulse"></div>
                  <div
                    className="h-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full animate-pulse"
                    style={{ width: '80%', marginLeft: '10%' }}
                  ></div>
                  <div
                    className="h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full animate-pulse"
                    style={{ width: '60%', marginLeft: '20%' }}
                  ></div>
                  <div
                    className="h-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full animate-pulse"
                    style={{ width: '90%', marginLeft: '5%' }}
                  ></div>
                  <div
                    className="h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full animate-pulse"
                    style={{ width: '70%', marginLeft: '15%' }}
                  ></div>
                </div>

                {/* Loading indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>

                <p className="text-gray-400 text-sm">
                  {t('indicator.fearAndGreed.loadingChart')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="w-32 h-3 bg-gray-600 rounded animate-pulse"></div>
            <div className="w-24 h-3 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
