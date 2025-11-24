"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POM = exports.PUR = exports.WBTC = exports.WETHb = exports.WETHe = exports.DAIe = exports.USDTb = exports.USDCe = exports.TOKENS_CONTRACTS = exports.BUILDNET_TOKENS = exports.MAINNET_TOKENS = void 0;
const utils_1 = require("../utils");
const token_1 = require("./token");
const utils_2 = require("./utils");
// kept for backwards compatibility
exports.MAINNET_TOKENS = {
    USDCe: 'AS1hCJXjndR4c9vekLWsXGnrdigp4AaZ7uYG3UKFzzKnWVsrNLPJ',
    USDTb: 'AS12LKs9txoSSy8JgFJgV96m8k5z9pgzjYMYSshwN67mFVuj3bdUV',
    DAIe: 'AS1ZGF1upwp9kPRvDKLxFAKRebgg7b3RWDnhgV7VvdZkZsUL7Nuv',
    WETHe: 'AS124vf3YfAJCSCQVYKczzuWWpXrximFpbTmX4rheLs5uNSftiiRY',
    WETHb: 'AS125oPLYRTtfVjpWisPZVTLjBhCFfQ1jDsi75XNtRm1NZux54eCj',
    PUR: 'AS133eqPPaPttJ6hJnk3sfoG5cjFFqBDi1VGxdo2wzWkq8AfZnan',
    WMAS: 'AS12U4TZfNK7qoLyEERBBRDMu8nm5MKoRzPXDXans4v9wdATZedz9',
    WBTCe: 'AS12fr54YtBY575Dfhtt7yftpT8KXgXb1ia5Pn1LofoLFLf9WcjGL',
};
// kept for backwards compatibility
exports.BUILDNET_TOKENS = {
    DAIs: 'AS12LpYyAjYRJfYhyu7fkrS224gMdvFHVEeVWoeHZzMdhis7UZ3Eb',
    WETHs: 'AS1gt69gqYD92dqPyE6DBRJ7KjpnQHqFzFs2YCkBcSnuxX5bGhBC',
    USDCs: 'AS12k8viVmqPtRuXzCm6rKXjLgpQWqbuMjc37YHhB452KSUUb9FgL',
    USDTbt: 'AS12ix1Qfpue7BB8q6mWVtjNdNE9UV3x4MaUo7WhdUubov8sJ3CuP',
    WETHbt: 'AS12RmCXTA9NZaTBUBnRJuH66AGNmtEfEoqXKxLdmrTybS6GFJPFs',
    WMAS: 'AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU',
    WBTCs: 'AS1ZXy3nvqXAMm2w6viAg7frte6cZfJM8hoMvWf4KoKDzvLzYKqE',
};
exports.TOKENS_CONTRACTS = {
    USDCe: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS1hCJXjndR4c9vekLWsXGnrdigp4AaZ7uYG3UKFzzKnWVsrNLPJ',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS12k8viVmqPtRuXzCm6rKXjLgpQWqbuMjc37YHhB452KSUUb9FgL',
    },
    USDTb: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS12LKs9txoSSy8JgFJgV96m8k5z9pgzjYMYSshwN67mFVuj3bdUV',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS12ix1Qfpue7BB8q6mWVtjNdNE9UV3x4MaUo7WhdUubov8sJ3CuP',
    },
    DAIe: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS1ZGF1upwp9kPRvDKLxFAKRebgg7b3RWDnhgV7VvdZkZsUL7Nuv',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS12LpYyAjYRJfYhyu7fkrS224gMdvFHVEeVWoeHZzMdhis7UZ3Eb',
    },
    WETHe: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS124vf3YfAJCSCQVYKczzuWWpXrximFpbTmX4rheLs5uNSftiiRY',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS1gt69gqYD92dqPyE6DBRJ7KjpnQHqFzFs2YCkBcSnuxX5bGhBC',
    },
    WETHb: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS125oPLYRTtfVjpWisPZVTLjBhCFfQ1jDsi75XNtRm1NZux54eCj',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS12RmCXTA9NZaTBUBnRJuH66AGNmtEfEoqXKxLdmrTybS6GFJPFs',
    },
    PUR: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS133eqPPaPttJ6hJnk3sfoG5cjFFqBDi1VGxdo2wzWkq8AfZnan',
    },
    POM: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS1nqHKXpnFXqhDExTskXmBbbVpVpUbCQVtNSXLCqUDSUXihdWRq',
    },
    WMAS: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS12U4TZfNK7qoLyEERBBRDMu8nm5MKoRzPXDXans4v9wdATZedz9',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS12FW5Rs5YN2zdpEnqwj4iHUUPt9R4Eqjq2qtpJFNKW3mn33RuLU',
    },
    WBTCe: {
        [utils_1.CHAIN_ID.Mainnet.toString()]: 'AS12fr54YtBY575Dfhtt7yftpT8KXgXb1ia5Pn1LofoLFLf9WcjGL',
        [utils_1.CHAIN_ID.Buildnet.toString()]: 'AS1ZXy3nvqXAMm2w6viAg7frte6cZfJM8hoMvWf4KoKDzvLzYKqE',
    },
};
///////////////// MULTI-NETWORK TOKENS //////////////////////
class USDCe extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.USDCe[chainId.toString()];
        if (!address) {
            throw new Error(`USDCe not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new USDCe(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new USDCe(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new USDCe(provider, chainId);
    }
}
exports.USDCe = USDCe;
class USDTb extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.USDTb[chainId.toString()];
        if (!address) {
            throw new Error(`USDTb not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new USDTb(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new USDTb(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new USDTb(provider, chainId);
    }
}
exports.USDTb = USDTb;
class DAIe extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.DAIe[chainId.toString()];
        if (!address) {
            throw new Error(`DAIe not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new DAIe(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new DAIe(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new DAIe(provider, chainId);
    }
}
exports.DAIe = DAIe;
class WETHe extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.WETHe[chainId.toString()];
        if (!address) {
            throw new Error(`WETHe not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new WETHe(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new WETHe(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new WETHe(provider, chainId);
    }
}
exports.WETHe = WETHe;
class WETHb extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.WETHb[chainId.toString()];
        if (!address) {
            throw new Error(`WETHb not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new WETHb(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new WETHb(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new WETHb(provider, chainId);
    }
}
exports.WETHb = WETHb;
class WBTC extends token_1.MRC20 {
    provider;
    constructor(provider, chainId = utils_1.CHAIN_ID.Mainnet) {
        (0, utils_2.checkNetwork)(provider, chainId === utils_1.CHAIN_ID.Mainnet);
        const address = exports.TOKENS_CONTRACTS.WBTCe[chainId.toString()];
        if (!address) {
            throw new Error(`WBTC not available on chain ${chainId}`);
        }
        super(provider, address);
        this.provider = provider;
    }
    static buildnet(provider) {
        (0, utils_2.checkNetwork)(provider, false);
        return new WBTC(provider, utils_1.CHAIN_ID.Buildnet);
    }
    static mainnet(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        return new WBTC(provider, utils_1.CHAIN_ID.Mainnet);
    }
    static async fromProvider(provider) {
        const { chainId } = await provider.networkInfos();
        return new WBTC(provider, chainId);
    }
}
exports.WBTC = WBTC;
///////////////// MAINNET-ONLY TOKENS //////////////////////
class PUR extends token_1.MRC20 {
    provider;
    constructor(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        const address = exports.TOKENS_CONTRACTS.PUR[utils_1.CHAIN_ID.Mainnet.toString()];
        super(provider, address);
        this.provider = provider;
    }
}
exports.PUR = PUR;
class POM extends token_1.MRC20 {
    provider;
    constructor(provider) {
        (0, utils_2.checkNetwork)(provider, true);
        const address = exports.TOKENS_CONTRACTS.POM[utils_1.CHAIN_ID.Mainnet.toString()];
        super(provider, address);
        this.provider = provider;
    }
}
exports.POM = POM;
