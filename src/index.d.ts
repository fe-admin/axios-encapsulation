import axios, { AxiosInstance, CancelToken, Method, AxiosResponse, AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';


export interface AxiosClass {
  Instance: AxiosInstance;
}

export interface AxiosConfig extends AxiosRequestConfig {
  axiosRetryConfig?: IAxiosRetryConfig;
  responseChain?: [],
  transformResponseData: (config: AxiosResponse) => any
}

export interface PendingItem {
  url: string | undefined;
  cancel: () => void;
  method: any;
  params: any;
}

export interface ResponseInterceptorsFunc {
  (source: AxiosResponse): Promise;
}

export default class AxiosInstanceClass implements AxiosClass {
  pending: PendingItem[];
  Instance: AxiosInstance;
  constructor(options: AxiosConfig);
  instance(options: AxiosConfig): void;
  removePending(config: any): void;
  setRequestInterceptors(): void;
}

export { };
