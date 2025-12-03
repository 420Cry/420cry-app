'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to ensure components only render on the client side
 * This prevents hydration mismatches caused by browser extensions
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
