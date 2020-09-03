import { PendingItem, AxiosConfig } from './index.d';

export function detectDuplicateRequests(request: PendingItem, config: AxiosConfig) {
  const { url, method, params } = request;
  let falg = false;
  if (config.url === url) {
    falg = true;
    if (method === 'get' && params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== config.params[key]) {
          falg = false
        };
      })
    }
  }
  return falg;
}

/**
 * 全局错误处理函数
 * @param {*} promise
 * @param {*} handle
 */
export function ErrorBoundary<T>(promise: Promise<T>, handle?: () => void): Promise<any> {
  return promise
    .then(data => [null, data])
    .catch(err => {
      console.info(err)
      if (!handle) {
        setTimeout(() => {
          throw Error(err.message);
        }, 16);
      }
      return [err];
    });
}