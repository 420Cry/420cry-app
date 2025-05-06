import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IApiResponse } from '@/types'

export class RequestService {  
  public static post<TResponseData, TRequestData>(
    url: string,
    data?: TRequestData,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<TResponseData>> {
    return this.makeRequest<TResponseData, TRequestData>('post', url, data, config)
  }

  public static get<TResponseData>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<TResponseData>> {
    return this.makeRequest<TResponseData>('get', url, undefined, config)
  }

  public static put<TResponseData, TRequestData>(
    url: string,
    data?: TRequestData,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<TResponseData>> {
    return this.makeRequest<TResponseData, TRequestData>('put', url, data, config)
  }

  public static delete<TResponseData>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<TResponseData>> {
    return this.makeRequest<TResponseData>('delete', url, undefined, config)
  }
  private static async makeRequest<TResponseData = unknown, TRequestData = unknown>(
    method: 'post' | 'get' | 'put' | 'delete',
    url: string,
    data?: TRequestData,
    config?: AxiosRequestConfig,
  ): Promise<IApiResponse<TResponseData>> {
    try {
      let response: AxiosResponse<TResponseData>
  
      if (method === 'get' || method === 'delete') {
        response = await axios[method]<TResponseData>(url, config)
      } else {
        response = await axios[method]<TResponseData>(url, data, config)
      }
  
      return {
        isSuccess: response.status === 200,
        message: response.status === 200
          ? 'app.alertTitle.successful'
          : 'app.alertTitle.somethingWentWrong',
        data: response.data,
      }
    } catch {
      return {
        isSuccess: false,
        message: 'app.alertTitle.somethingWentWrong',
      }
    }
  }
}