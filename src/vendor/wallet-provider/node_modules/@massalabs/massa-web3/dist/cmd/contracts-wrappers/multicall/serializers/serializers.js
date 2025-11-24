"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallResult = exports.CallParams = void 0;
const basicElements_1 = require("../../../basicElements");
class CallParams {
    contract;
    targetFunc;
    coins;
    params;
    constructor(contract = '', targetFunc = '', coins = 0n, params = new Uint8Array()) {
        this.contract = contract;
        this.targetFunc = targetFunc;
        this.coins = coins;
        this.params = params;
    }
    serialize() {
        return new basicElements_1.Args()
            .addString(this.contract)
            .addString(this.targetFunc)
            .addU64(this.coins)
            .addUint8Array(this.params)
            .serialize();
    }
    deserialize(data, offset = 0) {
        const args = new basicElements_1.Args(data, offset);
        this.contract = args.nextString();
        this.targetFunc = args.nextString();
        this.coins = args.nextU64();
        this.params = args.nextUint8Array();
        return { instance: this, offset: args.getOffset() };
    }
}
exports.CallParams = CallParams;
class CallResult {
    data;
    constructor(data = new Uint8Array()) {
        this.data = data;
    }
    serialize() {
        return new basicElements_1.Args().addUint8Array(this.data).serialize();
    }
    deserialize(data, offset = 0) {
        const args = new basicElements_1.Args(data, offset);
        this.data = args.nextUint8Array();
        return { instance: this, offset: args.getOffset() };
    }
}
exports.CallResult = CallResult;
