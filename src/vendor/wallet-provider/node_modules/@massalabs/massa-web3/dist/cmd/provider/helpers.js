"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProvider = void 0;
function isProvider(provider) {
    return (typeof provider === 'object' && provider !== null && 'callSC' in provider);
}
exports.isProvider = isProvider;
