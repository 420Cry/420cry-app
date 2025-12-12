'use client'

/**
 * React Context for Dependency Injection Container
 */

import { createContext, useContext, ReactNode } from 'react'
import {
  ServiceContainer,
  IAuthService,
  ITwoFactorService,
  IExternalService,
  IRequestService,
  ICookieService,
  ICurrencyService,
  ILocaleService,
  ISettingsService,
} from './ServiceContainer'
import { getContainer } from './container'

const ContainerContext = createContext<ServiceContainer | null>(null)

/**
 * Container Provider - Provides the DI container to the React tree
 */
export function ContainerProvider({
  children,
  container,
}: {
  children: ReactNode
  container?: ServiceContainer
}): JSX.Element {
  const containerInstance = container || getContainer()

  return (
    <ContainerContext.Provider value={containerInstance}>
      {children}
    </ContainerContext.Provider>
  )
}

/**
 * Hook to access the service container
 */
export function useContainer(): ServiceContainer {
  const container = useContext(ContainerContext)
  if (!container) {
    throw new Error(
      'useContainer must be used within a ContainerProvider. Make sure to wrap your app with ContainerProvider.',
    )
  }
  return container
}

/**
 * Hook to get a specific service from the container
 */
export function useService<T>(key: string): T {
  const container = useContainer()
  return container.get<T>(key)
}

/**
 * Convenience hooks for specific services
 */
export function useAuthService(): IAuthService {
  const container = useContainer()
  return container.getAuthService()
}

export function useTwoFactorService(): ITwoFactorService {
  const container = useContainer()
  return container.getTwoFactorService()
}

export function useExternalService(): IExternalService {
  const container = useContainer()
  return container.getExternalService()
}

export function useRequestService(): IRequestService {
  const container = useContainer()
  return container.getRequestService()
}

export function useCookieService(): ICookieService {
  const container = useContainer()
  return container.getCookieService()
}

export function useCurrencyService(): ICurrencyService {
  const container = useContainer()
  return container.getCurrencyService()
}

export function useLocaleService(): ILocaleService {
  const container = useContainer()
  return container.getLocaleService()
}

export function useSettingsService(): ISettingsService {
  const container = useContainer()
  return container.getSettingsService()
}
