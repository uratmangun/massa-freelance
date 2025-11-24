"use strict";
/* eslint-disable  @typescript-eslint/naming-convention, @typescript-eslint/no-non-null-assertion*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpRpcClient = void 0;
const retry_1 = require("./retry");
const headers = {
    'Content-Type': 'application/json',
};
function createIdStore() {
    return {
        current: 0,
        take() {
            return this.current++;
        },
        reset() {
            this.current = 0;
        },
    };
}
const idCache = createIdStore();
function getHttpRpcClient(url, opts = {}) {
    if (!opts.retry) {
        opts.retry = retry_1.DEFAULT_RETRY_OPTS;
    }
    return {
        async request(endpoint, params) {
            const response = await (0, retry_1.withRetry)(() => {
                const init = {
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: endpoint,
                        params: [params],
                        id: idCache.take(),
                    }),
                    headers,
                    method: 'POST',
                };
                return fetch(url, init);
            }, opts.retry);
            const data = await response.json();
            if (!response.ok || !!data.error) {
                throw new Error(data.error?.message);
            }
            return data.result;
        },
    };
}
exports.getHttpRpcClient = getHttpRpcClient;
