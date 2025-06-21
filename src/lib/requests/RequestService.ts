'use server-only'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

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

export class RequestService {
  // Axios POST
  public static async axiosPost<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return axios.post<TResponse>(url, payload, config)
  }

  // Axios GET
  public static async axiosGet<TParams, TResponse>(
    url: string,
    params?: TParams,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return axios.get<TResponse>(url, {
      ...config,
      params,
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
    TParams extends Record<string, unknown> | undefined,
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
