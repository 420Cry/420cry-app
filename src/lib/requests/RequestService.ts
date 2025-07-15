'use server-only'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getJWT } from '@/lib'

export class ApiError extends Error {
  public status: number
  public data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.status = status
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

type ExtendedAxiosConfig = AxiosRequestConfig & {
  withAuth?: boolean
}

export class RequestService {
  // Axios POST
  public static async axiosPost<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config: ExtendedAxiosConfig = {},
  ): Promise<AxiosResponse<TResponse>> {
    const jwt = config.withAuth ? await getJWT() : undefined

    const headers = {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...(config.headers || {}),
    }

    return axios.post<TResponse>(url, payload, {
      timeout: 60000,
      ...config,
      headers,
    })
  }

  // Axios GET
  public static async axiosGet<TParams, TResponse>(
    url: string,
    params?: TParams,
    config: ExtendedAxiosConfig = {},
  ): Promise<AxiosResponse<TResponse>> {
    const jwt = config.withAuth ? await getJWT() : undefined

    const headers = {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...(config.headers || {}),
    }

    return axios.get<TResponse>(url, {
      timeout: 60000,
      ...config,
      params,
      headers,
    })
  }

  // Native POST
  public static async nativeFetchPost<TPayload, TResponse>(
    url: string,
    body: TPayload,
  ): Promise<TResponse> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new ApiError('API Error', response.status, errorBody)
    }

    return response.json() as Promise<TResponse>
  }

  // Native GET
  public static async nativeFetchGet<
    TParams extends object | undefined,
    TResponse,
  >(url: string, params?: TParams): Promise<TResponse> {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              acc[key] = String(value)
              return acc
            },
            {} as Record<string, string>,
          ),
        ).toString()}`
      : ''

    const response = await fetch(`${url}${query}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new ApiError('API Error', response.status, errorBody)
    }

    return response.json() as Promise<TResponse>
  }
}
