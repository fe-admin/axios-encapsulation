/*
 * @Author: jubao.tian 
 * @Date: 2020-09-29 10:23:30 
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2020-09-29 15:13:36
 */
import axiosRetry from 'axios-retry';
import axios, { AxiosInstance, CancelToken } from 'axios';
import { detectDuplicateRequests } from './util';
import { AxiosClass, PendingItem, AxiosConfig } from './index.d';

const { CancelToken } = axios;
/**
 * axios encapsulation封装类
 */
export default class EncapsulationClass implements AxiosClass {
  pending: PendingItem[] = [];
  public axiosInstance;
  /**
   * 描述 构造函数
   * @date 2020-09-29
   * @param {any} options:AxiosConfig
   * @returns {any}
   */
  constructor(options: AxiosConfig) {
    // Axios实例
    const Instance: AxiosInstance = axios.create(options);
    this.axiosInstance = Instance;
    this.init(options);
  }

  /**
   * 初始化函数
   * @date 2020-09-29
   * @param {any} options:AxiosConfig
   * @returns {any}
   */
  init(options: AxiosConfig) {
    if (options.axiosRetryConfig) {
      axiosRetry(this.axiosInstance, options.axiosRetryConfig);
    }
    this.setRequestInterceptors(options);
    this.setResponseInterceptors(options);
  }

  removePending(config: any) {
    const { pending } = this;
    for (let index = 0; index < pending.length; index++) {
      const item: PendingItem = pending[index];
      const flag = config ? detectDuplicateRequests(item, config) : true
      if (flag) {
        item.cancel();
        pending.splice(index, 1);
      }
    }
  }

  /**
   * 设置请求拦截器
   * @date 2020-09-29
   * @returns {any}
   */
  setRequestInterceptors(options: AxiosConfig) {
    const { axiosInstance, pending } = this;
    const { requestChain } = options;
    axiosInstance.interceptors.request.use(config => {
      const { method, params } = config
      this.removePending(config);
      config.cancelToken = new CancelToken(executor => {
        const item: PendingItem = { url: config.url, cancel: executor, method, params }
        pending.push(item);
      });
      return config;
    });
    if (Array.isArray(requestChain)) {
      requestChain.forEach((executer: Function) => {
        axiosInstance.interceptors.request.use(
          config => executer(config)
        );
      })
    }
  }

  /**
   * 设置响应拦截器
   * @date 2020-09-29
   * @param {any} options:AxiosConfig
   * @returns {any}
   */
  setResponseInterceptors(options: AxiosConfig) {
    const { axiosInstance } = this;
    const { responseChain } = options;
    if (Array.isArray(responseChain)) {
      responseChain.forEach((executer: Function, index) => {
        axiosInstance.interceptors.response.use(
          res => {
            if (res) {
              index === 0 && this.removePending(res.config);
              return executer(res);
            }
          },
          (err) => {
            return Promise.reject(err);
          }
        );
      })
    }
  }
}

export { axios }


