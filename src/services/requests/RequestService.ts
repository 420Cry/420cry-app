'server-only'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export class RequestService {
  public static async post<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return axios.post<TResponse>(url, payload, config)
  }

  public static async get<TParams, TResponse>(
    url: string,
    params?: TParams,             
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return axios.get<TResponse>(url, {
      ...config,
      params,                    
    })
  }
}
