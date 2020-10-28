import axios, { AxiosInstance, CancelToken, Method, AxiosResponse, AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';


export interface AxiosClass {
  axiosInstance: AxiosInstance;
}

export interface AxiosConfig extends AxiosRequestConfig {
  axiosRetryConfig?: IAxiosRetryConfig;
  requestChain?: [],
  responseChain?: [],
  transformResponseData: (config: AxiosResponse) => any
}

export interface PendingItem {
  url: string | undefined;
  cancel: () => void;
  method: any;
  params: any;
}


export default class EncapsulationClass implements AxiosClass {
  pending: PendingItem[];
  axiosInstance: AxiosClass;
  constructor(options: AxiosConfig);
  init(options: AxiosConfig): void;
  removePending(config: any): void;
  setRequestInterceptors(): void;
  setResponseInterceptors(): void;
}

export interface Executer {
  (res: AxiosResponse): Promise;
}