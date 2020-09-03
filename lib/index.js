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
var lodash_set_1 = __importDefault(require("lodash.set"));
var axios_retry_1 = __importDefault(require("axios-retry"));
var axios_1 = __importDefault(require("axios"));
var util_1 = require("./util");
var CancelToken = axios_1.default.CancelToken;
var AxiosInstanceClass = /** @class */ (function () {
    function AxiosInstanceClass(options) {
        this.pending = [];
        var Instance = axios_1.default.create(options);
        this.Instance = Instance;
        this.instance(options);
    }
    AxiosInstanceClass.prototype.instance = function (options) {
        if (options.axiosRetryConfig) {
            axios_retry_1.default(this.Instance, options.axiosRetryConfig);
        }
        this.setRequestInterceptors();
        this.setResponseInterceptors(options);
    };
    AxiosInstanceClass.prototype.removePending = function (config) {
        var pending = this.pending;
        for (var index = 0; index < pending.length; index++) {
            var item = pending[index];
            var flag = config ? util_1.detectDuplicateRequests(item, config) : true;
            if (flag) {
                item.cancel();
                pending.splice(index, 1);
            }
        }
    };
    AxiosInstanceClass.prototype.addRequestInterceptors = function (path, value) {
        var Instance = this.Instance;
        Instance.interceptors.request.use(function (config) {
            lodash_set_1.default(config, path, value);
            return config;
        });
    };
    AxiosInstanceClass.prototype.setRequestInterceptors = function () {
        var _this = this;
        var _a = this, Instance = _a.Instance, pending = _a.pending;
        Instance.interceptors.request.use(function (config) {
            var method = config.method, params = config.params;
            if (config.method === 'get') {
                config.params = __assign(__assign({}, config.params), { stamp: Math.random() });
            }
            _this.removePending(config);
            config.cancelToken = new CancelToken(function (executor) {
                var item = { url: config.url, cancel: executor, method: method, params: params };
                pending.push(item);
            });
            return config;
        });
    };
    AxiosInstanceClass.prototype.addResponseInterceptors = function (callback) {
        var Instance = this.Instance;
        Instance.interceptors.response.use(function (res) { return callback(res); });
    };
    AxiosInstanceClass.prototype.setResponseInterceptors = function (options) {
        var _this = this;
        var Instance = this.Instance;
        var transformResponseData = options.transformResponseData;
        Instance.interceptors.response.use(function (res) {
            if (res) {
                _this.removePending(res.config);
                return transformResponseData(res);
            }
        }, function (err) {
            return Promise.reject(err);
        });
    };
    return AxiosInstanceClass;
}());
exports.default = AxiosInstanceClass;
