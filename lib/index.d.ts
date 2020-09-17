import { AxiosInstance } from 'axios';
import { AxiosClass, PendingItem, AxiosConfig } from './index.d';
export default class AxiosInstanceClass implements AxiosClass {
    pending: PendingItem[];
    Instance: AxiosInstance;
    constructor(options: AxiosConfig);
    instance(options: AxiosConfig): void;
    removePending(config: any): void;
    addRequestInterceptors(path: string, value: object): void;
    setRequestInterceptors(): void;
    setResponseInterceptors(options: AxiosConfig): void;
}
