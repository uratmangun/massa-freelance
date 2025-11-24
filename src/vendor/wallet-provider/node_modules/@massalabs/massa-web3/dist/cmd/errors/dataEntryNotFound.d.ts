import { ErrorBase } from './base';
type ErrorDataEntryNotFoundParameters = {
    key: Uint8Array | string;
    address: string;
    details?: string;
};
/**
 * Error class for handling the situation when a data entry has not been found in a smart contract datastore.
 */
export declare class ErrorDataEntryNotFound extends ErrorBase {
    /**
     * Override the name to clearly identify this as a ErrorDataEntryNotFound.
     */
    name: string;
    /**
     * Constructs a ErrorDataEntryNotFound with a message indicating the missing data entry.
     * @param key - The key of the data entry that was not found.
     * @param address - The address of the smart contract datastore where the entry was expected.
     * @param details - Optional details to provide more context about the error.
     */
    constructor({ key, address, details }: ErrorDataEntryNotFoundParameters);
}
export {};
