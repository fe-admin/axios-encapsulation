import { PendingItem } from "../index.d";
import { AxiosRequestConfig } from "axios";

export function detectDuplicateRequests(
  request: PendingItem,
  config: AxiosRequestConfig
): boolean {
  const { url, method } = request;
  let {  params } = request;
  let flag = false;
  if (config.url === url && config.method === method) {
    if (!config.params) config.params = {};
    if (!params) params = {};
    if(method === 'get') {
        delete params.stamp;
        delete config.params.stamp;
        if (JSON.stringify(params) === JSON.stringify(config.params)) {
            flag = true;
        }
    } else {
        if (JSON.stringify(params) === JSON.stringify(config.params))
        flag = true;
    }
  }
  return flag;
}
