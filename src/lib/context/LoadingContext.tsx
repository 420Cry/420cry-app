'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface LoadingContextProps {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context)
    throw new Error('useLoading must be used within LoadingProvider')
  return context
}
