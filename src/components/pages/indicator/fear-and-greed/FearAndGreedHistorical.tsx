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

// Modern rainbow colors inspired by Bitcoin rainbow chart
const CLASSIFICATION_COLORS: Record<string, string> = {
  'Extreme Fear': '#FF1744', // Deep red
  Fear: '#FF6F00', // Orange
  Neutral: '#FFD600', // Yellow
  Greed: '#00E676', // Green
  'Extreme Greed': '#00BCD4', // Cyan
}

// Gradient function for dynamic line colors based on fear/greed values
let width: number,
  height: number,
  gradient: CanvasGradient | null,
  lastDataHash: string

function getGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: any,
  data: number[],
): CanvasGradient | null {
  const chartWidth = chartArea.right - chartArea.left
  const chartHeight = chartArea.bottom - chartArea.top
  const dataHash = data.join(',')

  if (
    !gradient ||
    width !== chartWidth ||
    height !== chartHeight ||
    lastDataHash !== dataHash
  ) {
    // Create the gradient because this is either the first render,
    // the size of the chart has changed, or the data has changed
    width = chartWidth
    height = chartHeight
    lastDataHash = dataHash

    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)

    // Create color stops based on fear/greed classification
    // Map values to color stops (0-100 scale)
    const colorStops = [
      { value: 0, color: CLASSIFICATION_COLORS['Extreme Fear'] },
      { value: 25, color: CLASSIFICATION_COLORS['Fear'] },
      { value: 50, color: CLASSIFICATION_COLORS['Neutral'] },
      { value: 75, color: CLASSIFICATION_COLORS['Greed'] },
      { value: 100, color: CLASSIFICATION_COLORS['Extreme Greed'] },
    ]

    colorStops.forEach(({ value, color }) => {
      gradient!.addColorStop(value / 100, color)
    })
  }

  return gradient
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
          borderWidth: 4,
          pointRadius: 2,
          pointHoverRadius: 4,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          tension: 0.4,
          borderColor: function (context: any) {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) {
              // This case happens on initial chart load
              return '#3b82f6'
            }
            return getGradient(ctx, chartArea, chartData) || '#3b82f6'
          },
          borderDash: [],
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          // Add gradient fill
          fill: {
            target: 'origin',
            above: 'rgba(59, 130, 246, 0.1)', // Light blue fill above line
          },
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
        left: 20,
        right: 20,
        top: 20,
        bottom: 40,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
      axis: 'x',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex
            const dataPoint = filteredData[dataIndex]
            return new Date(
              Number(dataPoint.timestamp) * 1000,
            ).toLocaleDateString()
          },
          label: (context) => {
            const dataIndex = context.dataIndex
            const dataPoint = filteredData[dataIndex]
            return [
              `Value: ${dataPoint.value}`,
              `Classification: ${dataPoint.value_classification}`,
            ]
          },
        },
      },
      title: {
        display: true,
        text: 'Fear & Greed Index',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#ffffff',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'normal',
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        border: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
      y: {
        min: 0,
        max: 100,
        display: true,
        title: {
          display: true,
          text: 'Fear & Greed Index',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#9ca3af',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'normal',
          },
          callback: function (value) {
            return value + ''
          },
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        border: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
    },
  }

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
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">
                  {t('indicator.fearAndGreed.liveData')}
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
                className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1.5 text-sm font-medium text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
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

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(CLASSIFICATION_COLORS).map(
                ([classification, color]) => (
                  <div key={classification} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-gray-600 shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-xs font-medium text-gray-300">
                      {classification}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-gray-950 p-6">
          <div className="relative min-h-[400px] md:h-[500px]">
            <Line data={chartConfig} options={chartOptions} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{t('indicator.fearAndGreed.dataSource')}</span>
            <span>{t('indicator.fearAndGreed.updatedHourly')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
