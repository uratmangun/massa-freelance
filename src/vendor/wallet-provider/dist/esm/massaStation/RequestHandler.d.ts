/**
 * This interface represents a payload returned by making an http call
 */
export type JsonRpcResponseData<T> = {
    result: T;
};
/**
 * This method makes a GET request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export declare function getRequest<T>(url: string, timeout?: number): Promise<JsonRpcResponseData<T>>;
/**
 * This method makes a POST request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @param body - The body of the request.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export declare function postRequest<T>(url: string, body: object): Promise<JsonRpcResponseData<T>>;
/**
 * This method makes a DELETE request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export declare function deleteRequest<T>(url: string): Promise<JsonRpcResponseData<T>>;
/**
 * This method makes a PUT request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @param body - The body of the request.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export declare function putRequest<T>(url: string, body: object): Promise<JsonRpcResponseData<T>>;
//# sourceMappingURL=RequestHandler.d.ts.map