"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImmutable = exports.makeImmutable = void 0;
const __1 = require("..");
const networks_1 = require("../utils/networks");
async function makeImmutable(address, provider, waitFinal = false) {
    const operation = await provider.callSC({
        func: 'upgradeSC',
        target: address,
    });
    await (waitFinal
        ? operation.waitFinalExecution()
        : operation.waitSpeculativeExecution());
    return operation;
}
exports.makeImmutable = makeImmutable;
async function isImmutable(address, provider, final = false) {
    const networkInfo = await provider.networkInfos();
    let nodeUrl = networkInfo.url;
    if (!nodeUrl) {
        nodeUrl = (0, networks_1.getPublicApiByChainId)(networkInfo.chainId);
        if (!nodeUrl) {
            throw new Error(`Unknown network chainId: ${networkInfo.chainId}`);
        }
    }
    const client = new __1.PublicAPI(nodeUrl);
    const bytecode = await client.getAddressesBytecode({
        address: address,
        is_final: final, // eslint-disable-line @typescript-eslint/naming-convention
    });
    return bytecode.length === 0;
}
exports.isImmutable = isImmutable;
