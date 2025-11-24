import { Operation } from '../operation';
import { Provider, PublicProvider } from '../provider';
import { CallSCOptions, ReadSCOptions, SmartContract } from '../smartContracts';
export declare const MNS_CONTRACTS: {
    mainnet: string;
    buildnet: string;
};
export declare class MNS extends SmartContract {
    constructor(provider: Provider | PublicProvider, chainId: bigint);
    static init(provider: Provider | PublicProvider): Promise<MNS>;
    static mainnet(provider: Provider | PublicProvider): MNS;
    static buildnet(provider: Provider | PublicProvider): MNS;
    resolve(name: string, options?: ReadSCOptions): Promise<string>;
    fromAddress(address: string, options?: ReadSCOptions): Promise<string[]>;
    getDomainsFromTarget(target: string, final?: boolean): Promise<string[]>;
    alloc(name: string, owner: string, options?: CallSCOptions): Promise<Operation>;
    getTokenId(name: string): Promise<bigint>;
    free(name: string, options?: CallSCOptions): Promise<Operation>;
    updateTarget(name: string, newTarget: string, options?: CallSCOptions): Promise<Operation>;
    getOwnedDomains(address: string, final?: boolean): Promise<string[]>;
    getTargets(domains: string[], final?: boolean): Promise<string[]>;
    dnsAllocCost(domain: string, options?: ReadSCOptions): Promise<bigint>;
    transferFrom(domain: string, currentOwner: string, newOwner: string, options?: CallSCOptions): Promise<Operation>;
    balanceOf(owner: string, options?: ReadSCOptions): Promise<bigint>;
}
