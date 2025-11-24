export type I32_t = bigint;
export declare const SIZE_BYTE = 4;
export declare const SIZE_BIT = 32;
export declare const MIN: bigint;
export declare const MAX: bigint;
/**
 * Converts an I32 value to bytes
 *
 * @param value - The number to convert
 * @returns The bytes representation of the number
 * @throws if the value is out of range for I32
 */
export declare function toBytes(value: I32_t): Uint8Array;
/**
 * Converts bytes to an I32 value
 *
 * @remarks
 * Silently ignores bytes that are not needed to represent the I32 value.
 *
 * @param bytes - The bytes to convert
 * @returns The I32 representation of the bytes
 */
export declare function fromBytes(bytes: Uint8Array): I32_t;
/**
 * Converts an I32 value to a number
 * @param buffer - The buffer to read from
 * @param offset - The optional offset in the buffer at which to start reading the I32 value (default: 0)
 * @returns The I32 representation of the bytes
 */
export declare function fromBuffer(buffer: Uint8Array, offset: number): {
    value: I32_t;
    offset: number;
};
/**
 * Converts a number to an I32 value
 *
 * @param value - The number to convert
 * @returns The I32 representation of the number
 * @throws if the value is not a safe integer or out of range for I32
 */
export declare function fromNumber(value: number): I32_t;
