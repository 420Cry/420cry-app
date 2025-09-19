'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { JSX } from 'react/jsx-runtime'

interface LoadingContextProps {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined)

export function LoadingProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading(): {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
} {
  const context = useContext(LoadingContext)
  if (!context)
    throw new Error('useLoading must be used within LoadingProvider')
  return context
}
