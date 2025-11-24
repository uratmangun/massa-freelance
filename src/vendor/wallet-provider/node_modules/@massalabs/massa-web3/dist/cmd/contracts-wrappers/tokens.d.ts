import { Provider, PublicProvider } from '../provider';
import { MRC20 } from './token';
export declare const MAINNET_TOKENS: {
    USDCe: string;
    USDTb: string;
    DAIe: string;
    WETHe: string;
    WETHb: string;
    PUR: string;
    WMAS: string;
    WBTCe: string;
};
export declare const BUILDNET_TOKENS: {
    DAIs: string;
    WETHs: string;
    USDCs: string;
    USDTbt: string;
    WETHbt: string;
    WMAS: string;
    WBTCs: string;
};
export declare const TOKENS_CONTRACTS: {
    USDCe: {
        [x: string]: string;
    };
    USDTb: {
        [x: string]: string;
    };
    DAIe: {
        [x: string]: string;
    };
    WETHe: {
        [x: string]: string;
    };
    WETHb: {
        [x: string]: string;
    };
    PUR: {
        [x: string]: string;
    };
    POM: {
        [x: string]: string;
    };
    WMAS: {
        [x: string]: string;
    };
    WBTCe: {
        [x: string]: string;
    };
};
export declare class USDCe extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): USDCe;
    static mainnet(provider: Provider | PublicProvider): USDCe;
    static fromProvider(provider: Provider | PublicProvider): Promise<USDCe>;
}
export declare class USDTb extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): USDTb;
    static mainnet(provider: Provider | PublicProvider): USDTb;
    static fromProvider(provider: Provider | PublicProvider): Promise<USDTb>;
}
export declare class DAIe extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): DAIe;
    static mainnet(provider: Provider | PublicProvider): DAIe;
    static fromProvider(provider: Provider | PublicProvider): Promise<DAIe>;
}
export declare class WETHe extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): WETHe;
    static mainnet(provider: Provider | PublicProvider): WETHe;
    static fromProvider(provider: Provider | PublicProvider): Promise<WETHe>;
}
export declare class WETHb extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): WETHb;
    static mainnet(provider: Provider | PublicProvider): WETHb;
    static fromProvider(provider: Provider | PublicProvider): Promise<WETHb>;
}
export declare class WBTC extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): WBTC;
    static mainnet(provider: Provider | PublicProvider): WBTC;
    static fromProvider(provider: Provider | PublicProvider): Promise<WBTC>;
}
export declare class PUR extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider);
}
export declare class POM extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider);
}
