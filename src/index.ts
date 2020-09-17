import set from 'lodash.set';
import axiosRetry from 'axios-retry';
import axios, { AxiosInstance, CancelToken } from 'axios';
import { detectDuplicateRequests } from './util';
import { AxiosClass, PendingItem, AxiosConfig, ResponseInterceptorsFunc } from './index.d';

const { CancelToken } = axios;
export default class AxiosInstanceClass implements AxiosClass {
  pending: PendingItem[] = [];
  public Instance;
  constructor(options: AxiosConfig) {
    const Instance: AxiosInstance = axios.create(options);
    this.Instance = Instance;
    this.instance(options);
  }

  instance(options: AxiosConfig) {
    if (options.axiosRetryConfig) {
      axiosRetry(this.Instance, options.axiosRetryConfig);
    }
    this.setRequestInterceptors();
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

  addRequestInterceptors(path: string, value: object) {
    const { Instance } = this;
    Instance.interceptors.request.use(config => {
      set(config, path, value);
      return config;
    });
  }

  setRequestInterceptors() {
    const { Instance, pending } = this;
    Instance.interceptors.request.use(config => {
      const { method, params } = config
      if (config.method === 'get') {
        config.params = { ...config.params };
      }
      this.removePending(config);
      config.cancelToken = new CancelToken(executor => {
        const item: PendingItem = { url: config.url, cancel: executor, method, params }
        pending.push(item);
      });
      return config;
    });
  }


  setResponseInterceptors(options: AxiosConfig) {
    const { Instance } = this;
    const { responseChain } = options;
    if (Array.isArray(responseChain)) {
      responseChain.forEach((executer: Function, index) => {
        Instance.interceptors.response.use(
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


