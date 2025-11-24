/**
 * This file defines a TypeScript module with methods for performing GET, POST and DELETE http requests.
 *
 * @remarks
 * - The methods implemented here are quite generic and might be useful in other contexts too
 *  but have been particularly developed for making http calls specific to MassaStation's server API
 * - If you want to work on this repo, you will probably be interested in this object
 *
 */
import axios from 'axios';
const requestHeaders = {
    Accept: 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Content-Type': 'application/json',
};
/**
 * Handles errors from Axios requests.
 *
 * @param error - The error object thrown by Axios.
 * @throws a formatted error message.
 */
function handleAxiosError(error) {
    const err = error.response?.data?.message
        ? new Error(String(error.response.data.message))
        : new Error('Axios error: ' + String(error));
    throw err;
}
/**
 * This method makes a GET request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export async function getRequest(url, timeout) {
    try {
        const resp = await axios.get(url, {
            headers: requestHeaders,
            timeout,
        });
        return { result: resp.data };
    }
    catch (error) {
        handleAxiosError(error);
    }
}
/**
 * This method makes a POST request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @param body - The body of the request.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export async function postRequest(url, body) {
    try {
        const resp = await axios.post(url, body, {
            headers: requestHeaders,
        });
        return { result: resp.data };
    }
    catch (error) {
        handleAxiosError(error);
    }
}
/**
 * This method makes a DELETE request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export async function deleteRequest(url) {
    try {
        const resp = await axios.delete(url, {
            headers: requestHeaders,
        });
        return { result: resp.data };
    }
    catch (error) {
        handleAxiosError(error);
    }
}
/**
 * This method makes a PUT request to an http rest point.
 *
 *
 * @param url - The url to call.
 * @param body - The body of the request.
 * @returns a Promise that resolves to an instance of JsonRpcResponseData.
 *
 */
export async function putRequest(url, body) {
    try {
        const resp = await axios.put(url, body, {
            headers: requestHeaders,
        });
        return { result: resp.data };
    }
    catch (error) {
        handleAxiosError(error);
    }
}
//# sourceMappingURL=RequestHandler.js.map