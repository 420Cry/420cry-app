'use server-only'

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

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
  public static async nativeFetchPost(
    url: string,
    body: Record<string, unknown>,
  ): Promise<Response> {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
  // Native GET
  public static async nativeFetchGet(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<Response> {
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

    return fetch(`${url}${query}`, { method: 'GET' })
  }
}
