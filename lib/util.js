"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = exports.detectDuplicateRequests = void 0;
function detectDuplicateRequests(request, config) {
    var url = request.url, method = request.method, params = request.params;
    var falg = false;
    if (config.url === url) {
        falg = true;
        if (method === 'get' && params) {
            Object.keys(params).forEach(function (key) {
                if (params[key] !== config.params[key]) {
                    falg = false;
                }
                ;
            });
        }
    }
    return falg;
}
exports.detectDuplicateRequests = detectDuplicateRequests;
/**
 * 全局错误处理函数
 * @param {*} promise
 * @param {*} handle
 */
function ErrorBoundary(promise, handle) {
    return promise
        .then(function (data) { return [null, data]; })
        .catch(function (err) {
        console.info(err);
        if (!handle) {
            setTimeout(function () {
                throw Error(err.message);
            }, 16);
        }
        return [err];
    });
}
exports.ErrorBoundary = ErrorBoundary;
