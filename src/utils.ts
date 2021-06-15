import { PendingItem } from "../index.d";
import { AxiosRequestConfig } from "axios";

export function detectDuplicateRequests(
  request: PendingItem,
  config: AxiosRequestConfig
): boolean {
  const { url, method, params } = request;
  let flag = false;
  if (config.url === url && method === "get" && params) {
    flag = true;
    if (JSON.stringify(params) === JSON.stringify(config.params)) {
      flag = false;
    }
  }
  return flag;
}
