'use client'

import { JSX, useEffect, useState } from 'react'
import { externalService } from '@/lib'
import { IFearAndGreedIndexData, IFearAndGreedHistoricalData } from '@/types'
import { FearAndGreedHistorical, FearAndGreedIndex } from '@/components'
import { useTranslations } from 'next-intl'

export default function FearAndGreedPage(): JSX.Element {
  const [latestData, setLatestData] = useState<IFearAndGreedIndexData | null>(
    null,
  )
  const [historicalData, setHistoricalData] =
    useState<IFearAndGreedHistoricalData | null>(null)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const t = useTranslations()

  useEffect(() => {
    Promise.all([
      externalService.indicator.fearAndGreed.getFearAndGreedIndextLatest(),
      externalService.indicator.fearAndGreed.getFearAndGreedIndextHistorical(),
    ]).then(([latestResponse, historicalResponse]) => {
      if (latestResponse.isSuccess && latestResponse.data)
        setLatestData(latestResponse.data)
      if (historicalResponse.isSuccess && historicalResponse.data)
        setHistoricalData(historicalResponse.data)
    })
  }, [])

  if (!latestData || !historicalData) return <></>

  const toggleSection = (index: number) => {
    setExpandedSection((prev) => (prev === index ? null : index))
  }

  const getAccordionStyle = (isExpanded: boolean) => ({
    maxHeight: isExpanded ? '1000px' : '0',
    paddingBottom: isExpanded ? '1.5rem' : '0',
  })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:gap-12">
        <div className="md:flex-[3_3_0%] flex flex-col gap-8">
          {/* Use flex-col + items-center for horizontal centering */}
          <div className="flex flex-col items-center w-full">
            <FearAndGreedIndex data={latestData.data} />
          </div>

          <div className="w-full space-y-6">
            {[
              {
                title: t('indicator.fearAndGreed.about'),
                content: <p>{t('indicator.fearAndGreed.description')}</p>,
              },
              {
                title: t('indicator.fearAndGreed.section.howToUseThisIndex'),
                content: (
                  <ul className="list-disc ml-6 space-y-2">
                    {[
                      'marketSentimentAnalysis',
                      'contrarianStrategy',
                      'complementaryAnalysis',
                    ].map((key) => (
                      <li key={key}>
                        <strong>
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
                  <ol className="list-decimal ml-6 space-y-2">
                    {[
                      'priceMomentum',
                      'volatility',
                      'derivativesMarket',
                      'marketComposition',
                      'CMCProprietaryData',
                    ].map((key) => (
                      <li key={key}>
                        <strong>
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
                className="border rounded-lg bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center text-lg md:text-xl font-semibold hover:bg-gray-50 transition"
                  aria-expanded={expandedSection === index}
                  aria-controls={`section-${index}-content`}
                >
                  {section.title}
                  <span className="text-2xl">
                    {expandedSection === index ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`section-${index}-content`}
                  className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                  style={getAccordionStyle(expandedSection === index)}
                >
                  <div className="mt-2 text-gray-700">{section.content}</div>
                </div>
              </section>
            ))}
          </div>
        </div>
        {/* Right Column */}
        <div className="md:flex-[7_7_0%] flex items-center justify-center mt-10 md:mt-0">
          <FearAndGreedHistorical data={historicalData.data} />
        </div>
      </div>
    </main>
  )
}
