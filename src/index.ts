/*
 * @Author: jubao.tian
 * @Date: 2020-09-29 10:23:30
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2021-06-16 09:22:17
 */
import Retry from "axios-retry";
import axios, { AxiosRequestConfig } from "axios";
import { detectDuplicateRequests } from "./utils";
import {
  PendingItem,
  EncapsulationConfig,
  requestExecuter,
  responseExecuter,
} from "../index.d";

/**
 * axios encapsulation封装类
 */
export default class Encapsulation {
  pending: PendingItem[] = [];
  public Axios;

  constructor(options: EncapsulationConfig) {
    const { axiosConfig, retry, request, response } = options;
    this.Axios = axios.create(axiosConfig);
    if (retry) {
      Retry(this.Axios, retry);
    }
    request && this.setRequestInterceptors(request);
    response && this.setResponseInterceptors(response);
  }

  removePending(config: AxiosRequestConfig): void {
    const { pending } = this;
    for (let index = 0; index < pending.length; index++) {
      const item: PendingItem = pending[index];
      const flag = config ? detectDuplicateRequests(item, config) : true;
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

  setRequestInterceptors(request: requestExecuter[]): void {
    const { Axios, pending } = this;
    Axios.interceptors.request.use((config: AxiosRequestConfig) => {
      const { method, params } = config;
      this.removePending(config);
      const { CancelToken } = axios;
      config.cancelToken = new CancelToken((executor) => {
        const item: PendingItem = {
          url: config.url,
          cancel: executor,
          method: method,
          params,
        };
        pending.push(item);
      });
      return config;
    });

    if (Array.isArray(request)) {
      request.forEach((executer: requestExecuter) => {
        Axios.interceptors.request.use((config: AxiosRequestConfig) =>
          executer(config)
        );
      });
    }
  }

  /**
   * 设置响应拦截器
   */

  setResponseInterceptors(response: responseExecuter[]): void {
    const { Axios } = this;
    if (Array.isArray(response)) {
      response.forEach((executer: responseExecuter, index) => {
        Axios.interceptors.response.use(
          (res) => {
            if (res) {
              index === 0 && this.removePending(res.config);
              return executer(res);
            }
          },
          (err) => {
            return Promise.reject(err);
          }
        );
      });
    }
  }
}

export { axios };
