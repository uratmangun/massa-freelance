"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNetwork = void 0;
const utils_1 = require("../utils");
function checkNetwork(provider, isMainnet) {
    provider.networkInfos().then((network) => {
        if (isMainnet && network.chainId !== utils_1.CHAIN_ID.Mainnet) {
            console.warn('This contract is only available on mainnet');
        }
        else if (!isMainnet && network.chainId === utils_1.CHAIN_ID.Mainnet) {
            console.warn('This contract is only available on buildnet');
        }
    });
}
exports.checkNetwork = checkNetwork;
