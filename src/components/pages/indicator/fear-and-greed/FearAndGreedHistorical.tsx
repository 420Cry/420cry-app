'use client'

import React, { JSX, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { IFearAndGreedDataPoint } from '@/types'
import { useTranslations } from 'next-intl'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
)

// Colors by value_classification
const CLASSIFICATION_COLORS: Record<string, string> = {
  'Extreme Fear': '#EA3943',
  Fear: '#EA8C01',
  Neutral: '#F3D42F',
  Greed: '#93D900',
  'Extreme Greed': '#14C784',
}

interface FearAndGreedHistoricalProps {
  data: IFearAndGreedDataPoint[]
  className?: string
}

export const FearAndGreedHistorical = ({
  data,
  className = '',
}: FearAndGreedHistoricalProps): JSX.Element => {
  const t = useTranslations()
  const [range, setRange] = useState<'all' | 7 | 30 | 90 | 180 | 365>('all')

  // Sort by timestamp ascending
  const sortedData = useMemo(
    () => [...data].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)),
    [data],
  )

  // Filter based on range
  const filteredData = useMemo(() => {
    if (range === 'all') return sortedData
    return sortedData.slice(-range) // last N days
  }, [sortedData, range])

  // X labels: "MM/YYYY"
  const chartLabels = useMemo(
    () =>
      filteredData.map((p) =>
        new Date(Number(p.timestamp) * 1000).toLocaleDateString(undefined, {
          month: 'short',
          year: 'numeric',
        }),
      ),
    [filteredData],
  )

  const chartData = useMemo(
    () => filteredData.map((p) => p.value),
    [filteredData],
  )

  // Use value_classification for colors
  const pointColors = useMemo(
    () =>
      filteredData.map(
        (p) => CLASSIFICATION_COLORS[p.value_classification] ?? '#F3D42F',
      ),
    [filteredData],
  )

  const chartConfig: ChartData<'line'> = useMemo(
    () => ({
      labels: chartLabels,
      datasets: [
        {
          label: 'Fear & Greed Index',
          data: chartData,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointBorderWidth: 2,
          tension: 0.3,
          fill: false,
          borderColor: '#888',
        },
      ],
    }),
    [chartLabels, chartData, pointColors],
  )

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 30, // give extra bottom space for X-axis labels
      },
    },
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Historical Fear & Greed Index',
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Date (Month/Year)' },
        ticks: {
          color: '#555',
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: { color: '#eee' },
      },
      y: {
        min: 0,
        max: 100,
        display: true,
        title: { display: true, text: 'Index Value' },
        grid: { color: '#eee' },
      },
    },
  }

  return (
    <div
      className={`relative w-full min-h-[300px] md:h-[450px] border border-gray-300 rounded-lg p-4 bg-white shadow-sm ${className}`}
    >
      {/* Range filter */}
      <div className="mb-4 flex gap-2 items-center">
        <span>{t('indicator.fearAndGreed.historical.filterTitle')}</span>
        <select
          value={range}
          onChange={(e) => {
            const val = e.target.value
            setRange(
              val === 'all'
                ? 'all'
                : (parseInt(val) as 7 | 30 | 90 | 180 | 365),
            )
          }}
          className="border rounded px-2 py-1"
        >
          <option value="7">
            {t('indicator.fearAndGreed.historical.7days')}
          </option>
          <option value="30">
            {t('indicator.fearAndGreed.historical.30days')}
          </option>
          <option value="90">
            {t('indicator.fearAndGreed.historical.90days')}
          </option>
          <option value="180">
            {t('indicator.fearAndGreed.historical.180days')}
          </option>
          <option value="365">
            {t('indicator.fearAndGreed.historical.oneYear')}
          </option>
          <option value="all">
            {t('indicator.fearAndGreed.historical.all')}
          </option>
        </select>
      </div>

      <Line data={chartConfig} options={chartOptions} />
    </div>
  )
}
