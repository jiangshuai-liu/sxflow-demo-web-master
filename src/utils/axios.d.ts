// axios接口的处理
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as axios from 'axios'
 
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}
 