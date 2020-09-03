import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';
interface AxiosClass {
    Instance: AxiosInstance;
}
interface AxiosConfig extends AxiosRequestConfig {
    axiosRetryConfig?: IAxiosRetryConfig;
}
interface PendingItem {
    url: string | undefined;
    cancel: () => void;
    method: any;
    params: any;
}
export default class AxiosInstanceClass implements AxiosClass {
    pending: PendingItem[];
    Instance: AxiosInstance;
    constructor(options: AxiosConfig);
    instance(options: AxiosConfig): void;
    removePending(config: any): void;
    setRequestInterceptors(): void;
}
export {};
