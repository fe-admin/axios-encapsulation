import { Method, AxiosResponse, AxiosRequestConfig } from "axios";
import { IAxiosRetryConfig } from "axios-retry";

export interface EncapsulationConfig {
  retry?: IAxiosRetryConfig;
  request?: requestExecuter[];
  response?: responseExecuter[];
  axiosConfig?: AxiosRequestConfig;
}

export interface PendingItem {
  url: string | undefined;
  cancel: () => void;
  method?: Method;
  params: AxiosRequestConfig;
}

export interface requestExecuter {
  (params: AxiosRequestConfig): Promise;
}

export interface responseExecuter {
  (params: AxiosResponse): Promise;
}
