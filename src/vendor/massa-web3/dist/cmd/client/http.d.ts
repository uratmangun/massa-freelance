import { ClientOptions } from './types';
export type HttpRpcClient = {
    request<HttpRequestParameters, HttpRequestResult>(endpoint: string, params: HttpRequestParameters): Promise<HttpRequestResult>;
};
export declare function getHttpRpcClient(url: string, opts?: Partial<ClientOptions>): HttpRpcClient;
