import axios, { AxiosRequestConfig } from "axios";
import { PendingItem, EncapsulationConfig, requestExecuter, responseExecuter } from "../index.d";
/**
 * axios encapsulation封装类
 */
export default class Encapsulation {
    pending: PendingItem[];
    Axios: import("axios").AxiosInstance;
    constructor(options: EncapsulationConfig);
    removePending(config: AxiosRequestConfig): void;
    /**
     * 设置请求拦截器
     * @date 2020-09-29
     * @returns {any}
     */
    setRequestInterceptors(request: requestExecuter[]): void;
    /**
     * 设置响应拦截器
     */
    setResponseInterceptors(response: responseExecuter[]): void;
}
export { axios };
