'use client'

import { useEffect, useState } from 'react'
import { FearAndGreedService } from '@/lib'
import { IFearAndGreedIndexData } from '@/types'
import { FearAndGreedIndex } from '@/components'

export default function FearAndGreedPage() {
  const [indexData, setIndexData] = useState<IFearAndGreedIndexData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FearAndGreedService.geFearAndGreedIndextLatest()
        const data = response.data as IFearAndGreedIndexData
        setIndexData(data)
      } catch (error) {
        console.error('Error fetching Fear and Greed Index:', error)
      }
    }

    fetchData()
  }, [])

  if (!indexData) return null

  return (
    <div>
      <FearAndGreedIndex data={indexData.data} />
    </div>
  )
}
