/**
 * Service Container for Dependency Injection
 * Provides type-safe service registration and resolution
 */

// Service interfaces
export interface IRequestService {
  axiosPost<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ): Promise<import('axios').AxiosResponse<TResponse>>
  axiosPut<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ): Promise<import('axios').AxiosResponse<TResponse>>
  axiosGet<TParams, TResponse>(
    url: string,
    params?: TParams,
    config?: { withAuth?: boolean; headers?: Record<string, string> },
  ): Promise<import('axios').AxiosResponse<TResponse>>
  nativeFetchPost<TPayload, TResponse>(
    url: string,
    body: TPayload,
  ): Promise<TResponse>
  nativeFetchGet<TParams extends object | undefined, TResponse>(
    url: string,
    params?: TParams,
  ): Promise<TResponse>
}

export interface ICookieService {
  get(name: string): string | undefined
  set(name: string, value: string, options?: { expires?: number }): void
  remove(name: string): void
}

export interface ICurrencyService {
  getPreferredCurrency(): string
  setPreferredCurrency(currency: string): void
  formatCurrency(amount: number, currency: string): string
  getCurrencySymbol(currency: string): string
  getAllCurrencies(): string[]
}

export interface ILocaleService {
  changeLanguage(locale: string): Promise<void>
}

export interface ISettingsService {
  updateUserAccountName: {
    updateUsername(payload: {
      username: string
    }): Promise<import('@/types').IResponse>
  }
}

// Auth service interfaces
export interface ISignInService {
  signInAction(formData: FormData): Promise<{
    response: { isSuccess: boolean; message: string }
    user?: import('@/types').IUser
  }>
}

export interface ISignOutService {
  signOut(): Promise<{
    isSuccess: boolean
    message: string
  }>
}

export interface ISignUpService {
  signUpAction(formData: FormData): Promise<import('@/types').IResponse>
}

export interface IVerifyAccountTokenService {
  verifyToken(
    token: import('@/types').IVerifyAccountToken,
  ): Promise<import('@/types').IResponse>
}

export interface IVerifyEmailTokenService {
  verifyToken(
    payload: import('@/types').ISignUpVerificationToken,
  ): Promise<import('@/types').IResponse>
}

export interface IResetRequestService {
  resetRequestAction(formData: FormData): Promise<import('@/types').IResponse>
}

export interface IVerifyResetPasswordService {
  verifyResetPasswordAction(
    formData: FormData,
    resetPasswordToken?: string,
  ): Promise<import('@/types').IResponse>
}

export interface IAuthService {
  signIn: ISignInService
  signOut: ISignOutService
  signUp: {
    action: ISignUpService
    verifyAccount: IVerifyAccountTokenService
    verifyEmail: IVerifyEmailTokenService
  }
  resetPassword: {
    request: IResetRequestService
    verify: IVerifyResetPasswordService
  }
}

// 2FA service interfaces
export interface ITwoFactorAlternativeService {
  sendAlternativeEmailOTP(email: string): Promise<import('@/types').IResponse>
  verifyAlternativeToken(
    payload: import('@/types').ITwoFactorVerifyRequest,
  ): Promise<import('@/types').IResponse>
}

export interface ITwoFactorSetUpService {
  getQRCodeAndSecret(
    userUUID: import('@/types').ITwoFactorSetUpRequest,
  ): Promise<import('@/types').ITwoFactorSetUpResponse>
  verifyToken(payload: import('@/types').ITwoFactorSetUpRequest): Promise<{
    response: import('@/types').IResponse
    user?: import('@/types').IUser
  }>
  skipForNow(): Promise<import('@/types').IResponse>
}

export interface ITwoFactorVerifyService {
  verifyToken(
    payload: import('@/types').ITwoFactorVerifyRequest,
  ): Promise<import('@/types').IResponse>
}

export interface ITwoFactorService {
  alternative: ITwoFactorAlternativeService
  setup: ITwoFactorSetUpService
  verify: ITwoFactorVerifyService
}

// External service interfaces
export interface IFearAndGreedService {
  getFearAndGreedIndextLatest(): Promise<
    import('@/types').IResponse & {
      data?: import('@/types').IFearAndGreedIndexData
    }
  >
  getFearAndGreedIndextHistorical(): Promise<
    import('@/types').IResponse & {
      data?: import('@/types').IFearAndGreedHistoricalData
    }
  >
}

export interface ITransactionService {
  getTransaction(
    txid: string,
  ): Promise<
    import('@/types').IResponse & { data?: import('@/types').ITransactionData }
  >
  getTransactionByXPUB(
    xpub: string,
  ): Promise<
    import('@/types').IResponse & { data?: import('@/types').ITransactionXPUB }
  >
}

export interface IExternalService {
  indicator: {
    fearAndGreed: IFearAndGreedService
  }
  walletExplorer: {
    searchTransaction: ITransactionService
  }
}

/**
 * Service Container - Type-safe dependency injection container
 */
export class ServiceContainer {
  private services = new Map<string, unknown>()

  /**
   * Register a service with a key
   */
  public register<T>(key: string, service: T): void {
    this.services.set(key, service)
  }

  /**
   * Get a service by key
   */
  public get<T>(key: string): T {
    const service = this.services.get(key)
    if (!service) {
      throw new Error(`Service '${key}' not found in container`)
    }
    return service as T
  }

  /**
   * Check if a service is registered
   */
  public has(key: string): boolean {
    return this.services.has(key)
  }

  // Type-safe getters for services
  public getRequestService(): IRequestService {
    return this.get<IRequestService>('requestService')
  }

  public getCookieService(): ICookieService {
    return this.get<ICookieService>('cookieService')
  }

  public getCurrencyService(): ICurrencyService {
    return this.get<ICurrencyService>('currencyService')
  }

  public getLocaleService(): ILocaleService {
    return this.get<ILocaleService>('localeService')
  }

  public getSettingsService(): ISettingsService {
    return this.get<ISettingsService>('settingsService')
  }

  public getAuthService(): IAuthService {
    return this.get<IAuthService>('authService')
  }

  public getTwoFactorService(): ITwoFactorService {
    return this.get<ITwoFactorService>('twoFactorService')
  }

  public getExternalService(): IExternalService {
    return this.get<IExternalService>('externalService')
  }
}

// Service keys
export const SERVICE_KEYS = {
  REQUEST_SERVICE: 'requestService',
  COOKIE_SERVICE: 'cookieService',
  CURRENCY_SERVICE: 'currencyService',
  LOCALE_SERVICE: 'localeService',
  SETTINGS_SERVICE: 'settingsService',
  AUTH_SERVICE: 'authService',
  TWO_FACTOR_SERVICE: 'twoFactorService',
  EXTERNAL_SERVICE: 'externalService',
} as const
