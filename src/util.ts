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
