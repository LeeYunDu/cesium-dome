
import { AxiosRequestConfig } from 'axios'
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
  interface AxiosResponse<T = any> {
    msg:string,
    code:number,
    data:T,
    success:boolean,
    access_token?:string
  }
}
