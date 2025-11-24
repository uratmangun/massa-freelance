"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToStr = exports.strToBytes = void 0;
/**
 * Converts utf-16 string to a Uint8Array.
 *
 * @param str - the string to convert
 *
 * @returns the converted string
 */
function strToBytes(str) {
    if (!str.length) {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return new Uint8Array(0);
    }
    return new TextEncoder().encode(str);
}
exports.strToBytes = strToBytes;
/**
 * Converts Uint8Array to a string.
 *
 * @param arr - the array to convert
 *
 * @returns A string representation of the array in utf-8 encoding
 */
function bytesToStr(arr) {
    if (!arr.length) {
        return '';
    }
    return new TextDecoder().decode(arr);
}
exports.bytesToStr = bytesToStr;
