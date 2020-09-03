/**
 * 全局错误处理函数
 * @param {*} promise
 * @param {*} handle
 */
export declare function ErrorBoundary<T>(promise: Promise<T>, handle?: () => void): Promise<any>;
declare const deletes: <T = any, R = import("axios").AxiosResponse<T>>(url: string, config?: import("axios").AxiosRequestConfig | undefined) => Promise<R>;
declare const get: <T = any, R = import("axios").AxiosResponse<T>>(url: string, config?: import("axios").AxiosRequestConfig | undefined) => Promise<R>, post: <T = any, R = import("axios").AxiosResponse<T>>(url: string, data?: any, config?: import("axios").AxiosRequestConfig | undefined) => Promise<R>, put: <T = any, R = import("axios").AxiosResponse<T>>(url: string, data?: any, config?: import("axios").AxiosRequestConfig | undefined) => Promise<R>;
export { get, post, put, deletes, };
