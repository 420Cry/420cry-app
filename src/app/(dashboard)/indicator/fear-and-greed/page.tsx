'use client'

import { JSX, useEffect, useState } from 'react'
import { FearAndGreedService } from '@/lib'
import { IFearAndGreedIndexData, IFearAndGreedHistoricalData } from '@/types'
import { FearAndGreedHistorical, FearAndGreedIndex } from '@/components'
import { useTranslations } from 'next-intl'

export default function FearAndGreedPage(): JSX.Element {
  const [latestData, setLatestData] = useState<IFearAndGreedIndexData | null>(
    null,
  )
  const [historicalData, setHistoricalData] =
    useState<IFearAndGreedHistoricalData | null>(null)

  // Track which section is expanded (null = none)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const t = useTranslations()

  useEffect(() => {
    Promise.all([
      FearAndGreedService.geFearAndGreedIndextLatest(),
      FearAndGreedService.geFearAndGreedIndextHistorical(),
    ]).then(([latestResponse, historicalResponse]) => {
      if (latestResponse.isSuccess && latestResponse.data) {
        setLatestData(latestResponse.data)
      }
      if (historicalResponse.isSuccess && historicalResponse.data) {
        setHistoricalData(historicalResponse.data)
      }
    })
  }, [])

  if (!latestData || !historicalData) return <></>

  const toggleSection = (index: number) => {
    setExpandedSection((prev) => (prev === index ? null : index))
  }

  // Helper to set maxHeight style and padding bottom for smooth accordion
  const getAccordionStyle = (isExpanded: boolean) => ({
    maxHeight: isExpanded ? '1000px' : '0',
    paddingBottom: isExpanded ? '1.5rem' : '0',
  })

  return (
    <main className="max-w mx-auto p-6">
      <div className="flex flex-col md:flex-row md:gap-12">
        {/* Left column 3/10 */}
        <div className="md:flex-[3_3_0%] flex flex-col gap-6">
          <div className="w-full max-w-md ml-20">
            <FearAndGreedIndex data={latestData.data} />
          </div>

          {/* Accordion style text blocks */}
          <div className="space-y-6">
            <section className="border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => toggleSection(0)}
                className="w-full text-left p-6 flex justify-between items-center text-xl font-semibold"
                aria-expanded={expandedSection === 0}
                aria-controls="section-0-content"
              >
                {t('indicator.fearAndGreed.about')}
                <span>{expandedSection === 0 ? '−' : '+'}</span>
              </button>
              <div
                id="section-0-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 0)}
              >
                <p>{t('indicator.fearAndGreed.description')}</p>
              </div>
            </section>

            <section className="border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => toggleSection(1)}
                className="w-full text-left p-6 flex justify-between items-center text-lg font-semibold"
                aria-expanded={expandedSection === 1}
                aria-controls="section-1-content"
              >
                {t('indicator.fearAndGreed.section.howToUseThisIndex')}
                <span>{expandedSection === 1 ? '−' : '+'}</span>
              </button>
              <div
                id="section-1-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 1)}
              >
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>
                      {' '}
                      {t(
                        'indicator.fearAndGreed.section.marketSentimentAnalysis.title',
                      )}
                    </strong>
                    {t(
                      'indicator.fearAndGreed.section.marketSentimentAnalysis.content',
                    )}
                  </li>
                  <li>
                    <strong>
                      {t(
                        'indicator.fearAndGreed.section.contrarianStrategy.title',
                      )}
                    </strong>
                    {t(
                      'indicator.fearAndGreed.section.contrarianStrategy.content',
                    )}
                  </li>
                  <li>
                    <strong>
                      {t(
                        'indicator.fearAndGreed.section.complementaryAnalysis.title',
                      )}
                    </strong>
                    {t(
                      'indicator.fearAndGreed.section.complementaryAnalysis.content',
                    )}
                  </li>
                </ul>
              </div>
            </section>

            <section className="border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => toggleSection(2)}
                className="w-full text-left p-6 flex justify-between items-center text-lg font-semibold"
                aria-expanded={expandedSection === 2}
                aria-controls="section-2-content"
              >
                {t('indicator.fearAndGreed.section.howIsThisIndexCalculated')}
                <span>{expandedSection === 2 ? '−' : '+'}</span>
              </button>
              <div
                id="section-2-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 2)}
              >
                <ol className="list-decimal ml-5 space-y-2">
                  <li>
                    <strong>
                      {t('indicator.fearAndGreed.section.priceMomentum.title')}
                    </strong>
                    {t('indicator.fearAndGreed.section.priceMomentum.content')}
                  </li>
                  <li>
                    <strong>
                      {' '}
                      {t('indicator.fearAndGreed.section.volatility.title')}
                    </strong>
                    {t('indicator.fearAndGreed.section.volatility.content')}
                  </li>
                  <li>
                    <strong>
                      {' '}
                      {t(
                        'indicator.fearAndGreed.section.derivativesMarket.title',
                      )}
                    </strong>
                    {t(
                      'indicator.fearAndGreed.section.derivativesMarket.content',
                    )}
                  </li>
                  <li>
                    <strong>
                      {t(
                        'indicator.fearAndGreed.section.marketComposition.title',
                      )}
                    </strong>

                    {t(
                      'indicator.fearAndGreed.section.marketComposition.content',
                    )}
                  </li>
                  <li>
                    <strong>
                      {' '}
                      {t(
                        'indicator.fearAndGreed.section.CMCProprietaryData.title',
                      )}
                      :
                    </strong>
                    {t(
                      'indicator.fearAndGreed.section.CMCProprietaryData.content',
                    )}
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </div>
        <div className="md:flex-[7_7_0%] flex items-center justify-center mt-10 md:mt-0">
          <FearAndGreedHistorical data={historicalData.data} />
        </div>
      </div>
    </main>
  )
}
