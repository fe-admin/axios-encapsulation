import { Method, AxiosResponse, AxiosRequestConfig } from "axios";
import { IAxiosRetryConfig } from "axios-retry";

export interface EncapsulationConfig {
  retry?: IAxiosRetryConfig;
  request?: requestExecuter[];
  response?: responseExecuter[];
  axiosConfig?: AxiosRequestConfig;
}

export interface wrapAxiosRequestConfig extends AxiosRequestConfig{
  stamp?: never;
}

export interface PendingItem {
  url: string | undefined;
  cancel: () => void;
  method?: Method;
  params: wrapAxiosRequestConfig;
}

export interface requestExecuter {
  (params: AxiosRequestConfig): Promise;
}

export interface responseExecuter {
  (params: AxiosResponse): Promise;
}
