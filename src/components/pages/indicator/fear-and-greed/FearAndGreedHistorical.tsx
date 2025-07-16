'use client'

import React, { JSX, useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { IFearAndGreedDataPoint } from '@/types'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
)

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  blue: 'rgb(54, 162, 235)',
}

interface FearAndGreedHistoricalProps {
  data: IFearAndGreedDataPoint[]
  className?: string
}

export const FearAndGreedHistorical = ({
  data,
  className = '',
}: FearAndGreedHistoricalProps): JSX.Element => {
  const chartRef = useRef<ChartJS<'line'>>(null)

  // Prepare labels with shorter date format (e.g. 'MMM dd')
  const chartLabels = data.map((point) =>
    new Date(Number(point.timestamp) * 1000).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  )
  const chartData = data.map((point) => point.value)

  // Create gradient once canvas is ready
  useEffect(() => {
    if (!chartRef.current) return

    const chart = chartRef.current
    const ctx = chart.ctx
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)')
    gradient.addColorStop(1, 'rgba(255, 99, 132, 1)')

    // Update dataset borderColor with gradient
    if (chart.data.datasets[0]) {
      chart.data.datasets[0].borderColor = gradient
      chart.update()
    }
  }, [data])

  const chartConfig = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Fear and Greed Index',
        data: chartData,
        borderColor: CHART_COLORS.red, // fallback color, overridden by gradient
        backgroundColor: CHART_COLORS.red,
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Historical Fear and Greed Index',
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Date' },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          color: '#555',
          font: {
            size: 11,
          },
        },
        grid: {
          color: '#eee',
        },
      },
      y: {
        min: 0,
        max: 100,
        display: true,
        title: { display: true, text: 'Index Value' },
        grid: {
          color: '#eee',
        },
      },
    },
  }

  return (
    <div
      className={`relative w-full h-full md:h-[400px] border border-gray-300 rounded-lg p-4 bg-white shadow-sm ${className}`}
    >
      <Line ref={chartRef} data={chartConfig} options={chartOptions} />
    </div>
  )
}
