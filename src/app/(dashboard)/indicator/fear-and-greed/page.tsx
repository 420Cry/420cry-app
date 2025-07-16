'use client'

import { useEffect, useState } from 'react'
import { FearAndGreedService } from '@/lib'
import { IFearAndGreedIndexData, IFearAndGreedHistoricalData } from '@/types'
import { FearAndGreedHistorical, FearAndGreedIndex } from '@/components'

export default function FearAndGreedPage() {
  const [latestData, setLatestData] = useState<IFearAndGreedIndexData | null>(null)
  const [historicalData, setHistoricalData] = useState<IFearAndGreedHistoricalData | null>(null)

  // Track which section is expanded (null = none)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

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

  if (!latestData || !historicalData) return null

  const toggleSection = (index: number) => {
    setExpandedSection(prev => (prev === index ? null : index))
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
                About CMC Crypto Fear and Greed Index
                <span>{expandedSection === 0 ? '−' : '+'}</span>
              </button>
              <div
                id="section-0-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 0)}
              >
                <p>
                  The CMC Fear and Greed Index is a proprietary tool developed by CoinMarketCap that
                  measures the prevailing sentiment in the cryptocurrency market. This index ranges
                  from 0 to 100, where a lower value indicates extreme fear, and a higher value
                  indicates extreme greed. It helps investors understand the emotional state of the
                  market, which can influence buying and selling behaviors. The index provides
                  insights into whether the market may be undervalued (extreme fear) or overvalued
                  (extreme greed).
                </p>
              </div>
            </section>

            <section className="border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => toggleSection(1)}
                className="w-full text-left p-6 flex justify-between items-center text-lg font-semibold"
                aria-expanded={expandedSection === 1}
                aria-controls="section-1-content"
              >
                How can I use this index?
                <span>{expandedSection === 1 ? '−' : '+'}</span>
              </button>
              <div
                id="section-1-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 1)}
              >
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Market Sentiment Analysis:</strong> By observing the current value of the
                    index, you can gauge the overall mood of the cryptocurrency market. For example,
                    a high value suggests that investors are overly greedy, which may indicate that
                    the market is overheated and due for a correction. Conversely, a low value may
                    suggest that fear is driving prices down, potentially creating buying
                    opportunities.
                  </li>
                  <li>
                    <strong>Contrarian Strategy:</strong> Some investors use the index as part of a
                    contrarian investment strategy. The idea is to "be fearful when others are greedy
                    and greedy when others are fearful." If the index shows extreme greed, it might be
                    a signal to consider selling assets, while extreme fear could indicate a buying
                    opportunity.
                  </li>
                  <li>
                    <strong>Complementary Analysis:</strong> Use the index alongside other analytical
                    tools and indicators to make more informed decisions. It’s important to
                    remember that the index is a tool for gauging sentiment and should not be used in
                    isolation.
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
                How is this index calculated?
                <span>{expandedSection === 2 ? '−' : '+'}</span>
              </button>
              <div
                id="section-2-content"
                className="transition-max-height duration-300 ease-in-out overflow-hidden px-6"
                style={getAccordionStyle(expandedSection === 2)}
              >
                <ol className="list-decimal ml-5 space-y-2">
                  <li>
                    <strong>Price Momentum:</strong> This factor analyzes the price performance of the
                    top 10 cryptocurrencies by market capitalization (excluding stablecoins). It
                    assesses how these coins are performing relative to each other and the broader
                    market.
                  </li>
                  <li>
                    <strong>Volatility:</strong> The index incorporates Volmex Implied Volatility
                    Indices (BVIV and EVIV) for Bitcoin (BTC) and Ethereum (ETH), which provide
                    forward-looking measures of expected volatility over the next 30 days.
                  </li>
                  <li>
                    <strong>Derivatives Market:</strong> The index considers the Put/Call Ratio in the
                    Bitcoin and Ethereum options markets. A higher ratio of puts to calls indicates
                    more fear in the market, suggesting bearish expectations among investors.
                  </li>
                  <li>
                    <strong>Market Composition:</strong> This component looks at the relative value of
                    Bitcoin (BTC) in the market, using the Stablecoin Supply Ratio (SSR) to measure
                    the ratio between Bitcoin’s market capitalization and that of major stablecoins.
                  </li>
                  <li>
                    <strong>CMC Proprietary Data:</strong> The index also uses social trend keyword
                    searches and user engagement metrics to capture market sentiment, retail
                    interest, and emerging trends.
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </div>

        {/* Right column 7/10 */}
        <div className="md:flex-[7_7_0%] flex items-center justify-center mt-10 md:mt-0">
          <FearAndGreedHistorical data={historicalData.data} />
        </div>
      </div>
    </main>
  )
}
