"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datastoreEntry = exports.smartContractDeploy = exports.account = exports.bytes = void 0;
const _1 = require(".");
const mas_1 = require("./mas");
const ACCOUNT_SIZE_BYTES = 10;
const STORAGE_BYTE_COST = (0, mas_1.fromString)('0.0001');
const NEW_STORAGE_ENTRY_COST = 4n;
/**
 * Calculates the cost of a given number of bytes.
 *
 * @param numberOfBytes - The number of bytes.
 *
 * @returns The cost in the smallest unit of the Massa currency.
 */
function bytes(numberOfBytes) {
    return BigInt(numberOfBytes) * STORAGE_BYTE_COST;
}
exports.bytes = bytes;
/**
 * Calculates the cost of creating a new account.
 *
 * @returns The cost in the smallest unit of the Massa currency.
 */
function account() {
    return bytes(ACCOUNT_SIZE_BYTES);
}
exports.account = account;
/**
 * Calculates the cost of deploying a smart contract.
 *
 * @remarks
 * The cost of deploying a smart contract includes the cost of creating a new account.
 *
 * @param numberOfBytes - The number of bytes of the smart contract.
 *
 * @returns The cost in the smallest unit of the Massa currency.
 */
function smartContractDeploy(numberOfBytes) {
    return bytes(numberOfBytes) + account();
}
exports.smartContractDeploy = smartContractDeploy;
/**
 * Compute the storage cost for a given key and value size based on the documentation at:
 * https://docs.massa.net/docs/learn/storage-costs
 * @param key- The key to store
 * @param value - The value to store
 * @returns the storage cost for the given key and value size
 */
function datastoreEntry(key, value) {
    if (typeof key === 'string') {
        key = (0, _1.strToBytes)(key);
    }
    if (typeof value === 'string') {
        value = (0, _1.strToBytes)(value);
    }
    return ((BigInt(key.length) + BigInt(value.length) + NEW_STORAGE_ENTRY_COST) *
        STORAGE_BYTE_COST);
}
exports.datastoreEntry = datastoreEntry;
