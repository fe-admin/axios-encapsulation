"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletes = exports.put = exports.post = exports.get = exports.ErrorBoundary = void 0;
/*
 * @Author: jubao.tian
 * @Date: 2020-08-13 16:38:58
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2020-08-31 09:44:08
 */
var axios_retry_1 = __importDefault(require("axios-retry"));
var axios_1 = __importDefault(require("axios"));
var util_1 = require("./util");
var pending = [];
var Instance = axios_1.default.create({});
axios_retry_1.default(Instance, {
    retryDelay: function (retryCount) {
        return retryCount * 1000;
    },
    shouldResetTimeout: true,
    retryCondition: function (error) {
        return (error.config.method === 'get' || error.config.method === 'post');
    }
});
var cancelToken = axios_1.default.CancelToken;
var removePending = function (event) {
    for (var index = 0; index < pending.length; index++) {
        var item = pending[index];
        var flag = event ? util_1.detectDuplicateRequests(item, event) : true;
        if (flag) {
            item.cancel();
            pending.splice(item, 1);
        }
    }
};
Instance.interceptors.request.use(function (config) {
    var method = config.method, params = config.params;
    if (localStorage.getItem('token')) {
        config.headers.common.token = localStorage.getItem('token');
    }
    if (config.method === 'get') {
        config.params = __assign(__assign({}, config.params), { stamp: Math.random() });
    }
    removePending(config);
    config.cancelToken = new cancelToken(function (cb) {
        pending.push({ url: config.url, cancel: cb, method: method, params: params });
    });
    return config;
});
Instance.interceptors.response.use(function (res) {
    if (res) {
        removePending(res.config);
        if (res.data.code === 200) {
            return res.data.data || res.data.result;
        }
        if (res.data.code === TOKEN_OUT) {
            removePending(null);
            setTimeout(function () {
                localStorage.clear();
                var origin = location.origin;
                location.replace(origin + "/login");
            }, 500);
            throw Error('登录失效请重新登录！');
        }
        if (res.config.download) {
            if (res.data.size < 100) {
                return res.data.text().then(function (text) {
                    return Promise.reject(JSON.parse(text));
                });
            }
            else {
                try {
                    var url = window.URL.createObjectURL(new Blob([res.data]));
                    var link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.download = decodeURIComponent(res.config.download);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    return true;
                }
                catch (error) { }
            }
        }
        return Promise.reject(res.data);
    }
}, function (err) {
    if (!(err instanceof Cancel)) {
        if (/timeout/gi.test(err.message)) {
            err.message = '网络超时，请稍后再试！';
        }
        else if (/Network Error/gi.test(err.message)) {
            err.message = '网络错误，请稍后再试！';
        }
        return Promise.reject(err);
    }
    ;
});
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
var deletes = Instance.delete;
exports.deletes = deletes;
var get = Instance.get, post = Instance.post, put = Instance.put;
exports.get = get;
exports.post = post;
exports.put = put;
