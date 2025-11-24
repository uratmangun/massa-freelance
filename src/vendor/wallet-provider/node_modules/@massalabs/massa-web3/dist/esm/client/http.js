/* eslint-disable  @typescript-eslint/naming-convention, @typescript-eslint/no-non-null-assertion*/
import { DEFAULT_RETRY_OPTS, withRetry } from './retry';
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
export function getHttpRpcClient(url, opts = {}) {
    if (!opts.retry) {
        opts.retry = DEFAULT_RETRY_OPTS;
    }
    return {
        async request(endpoint, params) {
            const response = await withRetry(() => {
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
