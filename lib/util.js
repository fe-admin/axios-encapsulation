"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDuplicateRequests = void 0;
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
