"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toString = exports.fromString = exports.fromNanoMas = exports.fromMicroMas = exports.fromMilliMas = exports.fromMas = exports.ERROR_VALUE_TOO_LARGE = exports.ERROR_NOT_SAFE_INTEGER = exports.NB_DECIMALS = void 0;
const u64_1 = require("./serializers/number/u64");
exports.NB_DECIMALS = 9;
const SIZE_U64_BIT = 64;
const POWER_TEN = 10n;
exports.ERROR_NOT_SAFE_INTEGER = 'value is not a safe integer.';
exports.ERROR_VALUE_TOO_LARGE = 'value is too large.';
/**
 * Converts an integer value to the smallest unit of the Massa currency.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#description
 *
 * @param value - The integer value.
 * @returns The value in the smallest unit of the Massa currency.
 *
 * @throws An error if the value is not a safe integer.
 */
function fromMas(value) {
    return (0, u64_1.fromNumber)(value * POWER_TEN ** BigInt(exports.NB_DECIMALS));
}
exports.fromMas = fromMas;
/**
 * Converts an integer value in milli Massa to the smallest unit of the Massa currency.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#description
 *
 * @param value - The value in milli Massa.
 * @returns The value in the smallest unit of the Massa currency.
 *
 * @throws An error if the value is not a safe integer.
 */
function fromMilliMas(value) {
    const milli = 3;
    return (0, u64_1.fromNumber)(value * POWER_TEN ** BigInt(exports.NB_DECIMALS - milli));
}
exports.fromMilliMas = fromMilliMas;
/**
 * Converts an integer value in micro Massa to the smallest unit of the Massa currency.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#description
 *
 * @param value - The value in micro Massa.
 * @returns The value in the smallest unit of the Massa currency.
 *
 * @throws An error if the value is not a safe integer.
 */
function fromMicroMas(value) {
    const micro = 6;
    return (0, u64_1.fromNumber)(value * POWER_TEN ** BigInt(exports.NB_DECIMALS - micro));
}
exports.fromMicroMas = fromMicroMas;
/**
 * Converts an integer value in nano Massa to the smallest unit of the Massa currency.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#description
 *
 * @param value - The value in nano Massa.
 * @returns The value in the smallest unit of the Massa currency.
 *
 * @throws An error if the value is not a safe integer.
 */
function fromNanoMas(value) {
    const nano = 9;
    return (0, u64_1.fromNumber)(value * POWER_TEN ** BigInt(exports.NB_DECIMALS - nano));
}
exports.fromNanoMas = fromNanoMas;
/**
 * Converts a decimal value in Mas to the smallest unit of the Massa currency.
 *
 * @param value - The decimal value.
 * @returns The value in the smallest unit of the Massa currency.
 *
 * @throws An error if the format is not a decimal.
 * @throws An error if the value is too large to be represented by an U256 or has too many decimals.
 */
function fromString(value) {
    const parts = value.split('.');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (parts.length > 2) {
        throw new Error('invalid format');
    }
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';
    if (decimalPart.length > exports.NB_DECIMALS) {
        throw new Error(exports.ERROR_VALUE_TOO_LARGE);
    }
    const mas = BigInt(integerPart + decimalPart.padEnd(exports.NB_DECIMALS, '0'));
    return (0, u64_1.fromNumber)(mas);
}
exports.fromString = fromString;
/**
 * Converts a Mas value to a string with rounding approximation.
 *
 * @param value - The Mas value.
 * @param decimalPlaces - The number of decimal places to include in the string.
 * @returns The value as a string.
 *
 * @throws An error if the value is too large to be represented by a U64.
 */
function toString(value, decimalPlaces = null) {
    if (BigInt(value) >= 1n << BigInt(SIZE_U64_BIT)) {
        throw new Error(exports.ERROR_VALUE_TOO_LARGE);
    }
    let integerPart = value.toString().slice(0, -exports.NB_DECIMALS);
    let fractionalString = value
        .toString()
        .slice(-exports.NB_DECIMALS)
        .padStart(exports.NB_DECIMALS, '0');
    if (integerPart === '') {
        integerPart = '0';
    }
    if (decimalPlaces !== null) {
        fractionalString = fractionalString
            .slice(0, decimalPlaces)
            .padEnd(decimalPlaces, '0');
    }
    else {
        // Remove trailing zeros from the fractional part
        fractionalString = fractionalString.replace(/(?:0)+$/, '');
    }
    return fractionalString === ''
        ? integerPart
        : `${integerPart}.${fractionalString}`;
}
exports.toString = toString;
