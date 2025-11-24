"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["UnknownError"] = 0] = "UnknownError";
    ErrorCodes[ErrorCodes["MaxGasLimit"] = 1] = "MaxGasLimit";
    ErrorCodes[ErrorCodes["InsufficientBalance"] = 2] = "InsufficientBalance";
    ErrorCodes[ErrorCodes["MinimalFee"] = 3] = "MinimalFee";
    ErrorCodes[ErrorCodes["DataEntryNotFound"] = 4] = "DataEntryNotFound";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
