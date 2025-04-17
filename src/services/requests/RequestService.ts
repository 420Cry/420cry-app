import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export class RequestService {
  public static async post<T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.post<T>(url, data, config)
  }

  public static async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.get<T>(url, config)
  }

  public static async put<T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.put<T>(url, data, config)
  }

  public static async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.delete<T>(url, config)
  }
}
