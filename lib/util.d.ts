import { PendingItem, AxiosConfig } from './index.d';
export declare function detectDuplicateRequests(request: PendingItem, config: AxiosConfig): boolean;
/**
 * 全局错误处理函数
 * @param {*} promise
 * @param {*} handle
 */
export declare function ErrorBoundary<T>(promise: Promise<T>, handle?: () => void): Promise<any>;
