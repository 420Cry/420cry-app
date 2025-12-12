/**
 * Container initialization and service registration
 */

import {
  ServiceContainer,
  SERVICE_KEYS,
  type IRequestService,
} from './ServiceContainer'
import { RequestService } from '../requests/RequestService'
import { CookieService } from '../services/cookies/CookieService'
import { CurrencyService } from '../services/currency/CurrencyService'
import { localeService } from '../services/locale/localeService'
import { SettingsService } from '../services/settings/SettingsService'
import { AuthService } from '../services/auth/AuthService'
import { TwoFactorService } from '../services/2fa/TwoFactorService'
import { ExternalService } from '../services/external/ExternalService'

/**
 * Adapter to make RequestService (static methods) compatible with IRequestService interface
 */
class RequestServiceAdapter implements IRequestService {
  public async axiosPost<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ) {
    return RequestService.axiosPost<TPayload, TResponse>(url, payload, config)
  }

  public async axiosPut<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ) {
    return RequestService.axiosPut<TPayload, TResponse>(url, payload, config)
  }

  public async axiosGet<TParams, TResponse>(
    url: string,
    params?: TParams,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ) {
    return RequestService.axiosGet<TParams, TResponse>(url, params, config)
  }

  public async nativeFetchPost<TPayload, TResponse>(
    url: string,
    body: TPayload,
  ) {
    return RequestService.nativeFetchPost<TPayload, TResponse>(url, body)
  }

  public async nativeFetchGet<TParams extends object | undefined, TResponse>(
    url: string,
    params?: TParams,
  ) {
    return RequestService.nativeFetchGet<TParams, TResponse>(url, params)
  }
}

/**
 * Initialize and configure the service container with all dependencies
 */
export function createContainer(): ServiceContainer {
  const container = new ServiceContainer()

  // Register core services (no dependencies)
  // RequestService uses static methods, so we create an adapter
  const requestService = new RequestServiceAdapter()
  container.register(SERVICE_KEYS.REQUEST_SERVICE, requestService)
  container.register(SERVICE_KEYS.COOKIE_SERVICE, CookieService)
  container.register(SERVICE_KEYS.CURRENCY_SERVICE, CurrencyService)
  container.register(SERVICE_KEYS.LOCALE_SERVICE, localeService)

  // Settings Service (requires RequestService)
  const settingsService = new SettingsService(requestService)
  container.register(SERVICE_KEYS.SETTINGS_SERVICE, settingsService)

  // Register composite services (with dependencies)
  // Auth Service
  const authService = new AuthService(requestService)
  container.register(SERVICE_KEYS.AUTH_SERVICE, authService)

  // 2FA Service
  const twoFactorService = new TwoFactorService(requestService)
  container.register(SERVICE_KEYS.TWO_FACTOR_SERVICE, twoFactorService)

  // External Service
  const externalService = new ExternalService(requestService)
  container.register(SERVICE_KEYS.EXTERNAL_SERVICE, externalService)

  return container
}

// Default container instance (can be overridden for testing)
let defaultContainer: ServiceContainer | null = null

/**
 * Get or create the default container
 */
export function getContainer(): ServiceContainer {
  if (!defaultContainer) {
    defaultContainer = createContainer()
  }
  return defaultContainer
}

/**
 * Set a custom container (useful for testing)
 */
export function setContainer(container: ServiceContainer): void {
  defaultContainer = container
}

/**
 * Reset the default container
 */
export function resetContainer(): void {
  defaultContainer = null
}
