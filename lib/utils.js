"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDuplicateRequests = void 0;
function detectDuplicateRequests(request, config) {
    var url = request.url, method = request.method;
    var params = request.params;
    var flag = false;
    if (config.url === url && config.method === method) {
        if (!config.params)
            config.params = {};
        if (!params)
            params = {};
        if (method === 'get') {
            delete params.stamp;
            delete config.params.stamp;
            if (JSON.stringify(params) === JSON.stringify(config.params)) {
                flag = true;
            }
        }
        else {
            if (JSON.stringify(params) === JSON.stringify(config.params))
                flag = true;
        }
    }
    return flag;
}
exports.detectDuplicateRequests = detectDuplicateRequests;
