"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDataEntryNotFound = void 0;
const base_1 = require("./base");
const codes_1 = require("./utils/codes");
/**
 * Error class for handling the situation when a data entry has not been found in a smart contract datastore.
 */
class ErrorDataEntryNotFound extends base_1.ErrorBase {
    /**
     * Override the name to clearly identify this as a ErrorDataEntryNotFound.
     */
    name = 'ErrorDataEntryNotFound';
    /**
     * Constructs a ErrorDataEntryNotFound with a message indicating the missing data entry.
     * @param key - The key of the data entry that was not found.
     * @param address - The address of the smart contract datastore where the entry was expected.
     * @param details - Optional details to provide more context about the error.
     */
    constructor({ key, address, details }) {
        super(`The data entry with key ${key} was not found in the datastore of the contract at address ${address}.`, {
            code: codes_1.ErrorCodes.DataEntryNotFound,
            details,
        });
    }
}
exports.ErrorDataEntryNotFound = ErrorDataEntryNotFound;
