import { Operation } from '../../operation';
import { Provider, PublicProvider } from '../../provider';
import { Call } from './types';
export declare class Multicall {
    provider: Provider | PublicProvider;
    constructor(provider: Provider | PublicProvider);
    execute(calls: Call[], options?: {
        maxGas?: bigint;
        maxCoins?: bigint;
        fee?: bigint;
    }): Promise<Operation>;
}
