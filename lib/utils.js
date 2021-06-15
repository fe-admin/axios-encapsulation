"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDuplicateRequests = void 0;
function detectDuplicateRequests(request, config) {
    var url = request.url, method = request.method, params = request.params;
    var flag = false;
    if (config.url === url && method === "get" && params) {
        flag = true;
        console.info(params, config.params);
        if (JSON.stringify(params) === JSON.stringify(config.params)) {
            flag = false;
        }
    }
    return flag;
}
exports.detectDuplicateRequests = detectDuplicateRequests;
