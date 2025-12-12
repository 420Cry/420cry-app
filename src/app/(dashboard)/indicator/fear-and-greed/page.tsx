'use client'

import { JSX, useEffect, useState } from 'react'
import { IFearAndGreedIndexData, IFearAndGreedHistoricalData } from '@/types'
import { FearAndGreedHistorical, FearAndGreedIndex } from '@/components'
import { useTranslations } from 'next-intl'
import { useExternalService } from '@/lib'

export default function FearAndGreedPage(): JSX.Element {
  const [latestData, setLatestData] = useState<IFearAndGreedIndexData | null>(
    null,
  )
  const [historicalData, setHistoricalData] =
    useState<IFearAndGreedHistoricalData | null>(null)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations()
  const externalService = useExternalService()

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      externalService.indicator.fearAndGreed.getFearAndGreedIndextLatest(),
      externalService.indicator.fearAndGreed.getFearAndGreedIndextHistorical(),
    ])
      .then(([latestResponse, historicalResponse]) => {
        if (latestResponse.isSuccess && latestResponse.data)
          setLatestData(latestResponse.data)
        if (historicalResponse.isSuccess && historicalResponse.data)
          setHistoricalData(historicalResponse.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [externalService])

  const toggleSection = (index: number) => {
    setExpandedSection((prev) => (prev === index ? null : index))
  }

  const getAccordionStyle = (isExpanded: boolean) => ({
    maxHeight: isExpanded ? '1000px' : '0',
    paddingBottom: isExpanded ? '1.5rem' : '0',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('indicator.fearAndGreed.pageTitle')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('indicator.fearAndGreed.pageDescription')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Left Column - Index Gauge */}
        <div className="lg:flex-[3_3_0%] flex flex-col gap-8">
          <div className="flex justify-center lg:justify-start">
            <FearAndGreedIndex
              data={latestData?.data || null}
              isLoading={isLoading}
            />
          </div>

          {/* Information Sections */}
          <div className="w-full space-y-6">
            {[
              {
                title: t('indicator.fearAndGreed.about'),
                content: (
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {t('indicator.fearAndGreed.description')}
                  </p>
                ),
              },
              {
                title: t('indicator.fearAndGreed.section.howToUseThisIndex'),
                content: (
                  <ul className="list-disc ml-6 space-y-3">
                    {[
                      'marketSentimentAnalysis',
                      'contrarianStrategy',
                      'complementaryAnalysis',
                    ].map((key) => (
                      <li
                        key={key}
                        className="text-gray-700 dark:text-gray-200"
                      >
                        <strong className="text-gray-900 dark:text-white">
                          {t(`indicator.fearAndGreed.section.${key}.title`)}
                        </strong>
                        : {t(`indicator.fearAndGreed.section.${key}.content`)}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: t(
                  'indicator.fearAndGreed.section.howIsThisIndexCalculated',
                ),
                content: (
                  <ol className="list-decimal ml-6 space-y-3">
                    {[
                      'priceMomentum',
                      'volatility',
                      'derivativesMarket',
                      'marketComposition',
                      'CMCProprietaryData',
                    ].map((key) => (
                      <li
                        key={key}
                        className="text-gray-700 dark:text-gray-200"
                      >
                        <strong className="text-gray-900 dark:text-white">
                          {t(`indicator.fearAndGreed.section.${key}.title`)}
                        </strong>
                        : {t(`indicator.fearAndGreed.section.${key}.content`)}
                      </li>
                    ))}
                  </ol>
                ),
              },
            ].map((section, index) => (
              <section
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  aria-expanded={expandedSection === index}
                  aria-controls={`section-${index}-content`}
                >
                  {section.title}
                  <span className="text-2xl text-blue-500 dark:text-blue-400 transition-transform duration-200">
                    {expandedSection === index ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`section-${index}-content`}
                  className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                  style={getAccordionStyle(expandedSection === index)}
                >
                  <div className="pb-6 text-gray-600 dark:text-gray-300">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Right Column - Historical Chart */}
        <div className="lg:flex-[7_7_0%] flex items-start justify-center mt-8 lg:mt-0">
          <FearAndGreedHistorical
            data={historicalData?.data || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
