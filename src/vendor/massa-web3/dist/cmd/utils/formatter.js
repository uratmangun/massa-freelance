"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCallArgs = void 0;
function parseCallArgs(args) {
    const bytesOrArgs = args ?? new Uint8Array();
    return bytesOrArgs instanceof Uint8Array
        ? bytesOrArgs
        : bytesOrArgs.serialize();
}
exports.parseCallArgs = parseCallArgs;
