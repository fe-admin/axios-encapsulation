"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios = void 0;
/*
 * @Author: jubao.tian
 * @Date: 2020-09-29 10:23:30
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2021-06-16 09:22:17
 */
var axios_retry_1 = __importDefault(require("axios-retry"));
var axios_1 = __importDefault(require("axios"));
exports.axios = axios_1.default;
var utils_1 = require("./utils");
/**
 * axios encapsulation封装类
 */
var Encapsulation = /** @class */ (function () {
    function Encapsulation(options) {
        this.pending = [];
        var axiosConfig = options.axiosConfig, retry = options.retry, request = options.request, response = options.response;
        this.Axios = axios_1.default.create(axiosConfig);
        if (retry) {
            axios_retry_1.default(this.Axios, retry);
        }
        request && this.setRequestInterceptors(request);
        response && this.setResponseInterceptors(response);
    }
    Encapsulation.prototype.removePending = function (config) {
        var pending = this.pending;
        for (var index = 0; index < pending.length; index++) {
            var item = pending[index];
            var flag = utils_1.detectDuplicateRequests(item, config);
            if (flag) {
                item.cancel();
                pending.splice(index, 1);
            }
        }
    };
    /**
     * 设置请求拦截器
     * @date 2020-09-29
     * @returns {any}
     */
    Encapsulation.prototype.setRequestInterceptors = function (request) {
        var _this = this;
        var _a = this, Axios = _a.Axios, pending = _a.pending;
        if (Array.isArray(request)) {
            request.forEach(function (executer) {
                Axios.interceptors.request.use(function (config) {
                    var method = config.method, params = config.params;
                    _this.removePending(config);
                    var CancelToken = axios_1.default.CancelToken;
                    config.cancelToken = new CancelToken(function (executor) {
                        var item = {
                            url: config.url,
                            cancel: executor,
                            method: method,
                            params: params,
                        };
                        pending.push(item);
                    });
                    return executer(config);
                });
            });
        }
    };
    /**
     * 设置响应拦截器
     */
    Encapsulation.prototype.setResponseInterceptors = function (response) {
        var Axios = this.Axios;
        if (Array.isArray(response)) {
            response.forEach(function (executer) {
                Axios.interceptors.response.use(function (res) {
                    if (res) {
                        return executer(res);
                    }
                }, function (err) {
                    return Promise.reject(err);
                });
            });
        }
    };
    return Encapsulation;
}());
exports.default = Encapsulation;
