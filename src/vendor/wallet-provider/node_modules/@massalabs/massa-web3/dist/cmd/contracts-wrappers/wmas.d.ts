import { Operation } from '../operation';
import { Provider, PublicProvider } from '../provider';
import { MRC20 } from './token';
export declare class WMAS extends MRC20 {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider, chainId?: bigint);
    static buildnet(provider: Provider | PublicProvider): WMAS;
    static mainnet(provider: Provider | PublicProvider): WMAS;
    static fromProvider(provider: Provider | PublicProvider): Promise<WMAS>;
    wrap(amount: bigint): Promise<Operation>;
    unwrap(amount: bigint, recipient?: string): Promise<Operation>;
}
