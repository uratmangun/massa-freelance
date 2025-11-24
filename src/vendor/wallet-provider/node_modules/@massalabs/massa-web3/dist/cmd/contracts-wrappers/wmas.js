"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WMAS = void 0;
const basicElements_1 = require("../basicElements");
const helpers_1 = require("../provider/helpers");
const utils_1 = require("../utils");
const token_1 = require("./token");
const tokens_1 = require("./tokens");
const utils_2 = require("./utils");
class WMAS extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = tokens_1.TOKENS_CONTRACTS.WMAS[chainId.toString()];
        if (!address) {
            throw new Error(`WMAS not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new WMAS(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new WMAS(provider);
    }
    // Automatically detect the network and return the appropriate token address
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new WMAS(provider, chainId);
    }
    wrap(amount) {
        if (!(0, helpers_1.isProvider)(this.provider)) {
            throw new Error('Method not available for PublicProvider');
        }
        // check whether user has already created a balance entry
        const balanceKey = 'BALANCE' + this.provider.address;
        const storageVals = this.provider.readStorage(this.address, [balanceKey]);
        const storageCost = storageVals[0] === null
            ? basicElements_1.StorageCost.datastoreEntry(balanceKey, basicElements_1.U256.toBytes(0n))
            : 0n;
        return this.provider.callSC({
            target: this.address,
            func: 'deposit',
            coins: amount + storageCost,
        });
    }
    unwrap(amount, recipient = this.address) {
        if (!(0, helpers_1.isProvider)(this.provider)) {
            throw new Error('Method not available for PublicProvider');
        }
        return this.provider.callSC({
            target: this.address,
            func: 'withdraw',
            parameter: new basicElements_1.Args().addU64(amount).addString(recipient),
        });
    }
}
exports.WMAS = WMAS;
