import { Args } from '@massalabs/massa-web3';
/**
 * Converts a Uint8Array to a base64 string
 *
 * @param bytes - The Uint8Array to convert to base64
 * @returns The base64 string
 */
export declare function uint8ArrayToBase64(bytes: Uint8Array): string;
/**
 * Converts an Args object to a base64 string
 *
 * @param arg - The argument to convert to base64
 * @returns The base64 string
 */
export declare function argsToBase64(arg: Args): string;
export declare function base64ToByteArray(base64: string): Promise<Uint8Array>;
//# sourceMappingURL=base64.d.ts.map