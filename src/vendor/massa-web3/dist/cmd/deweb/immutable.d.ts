import { Provider, PublicProvider } from 'src/provider';
import { Operation } from 'src/operation';
export declare function makeImmutable(address: string, provider: Provider, waitFinal?: boolean): Promise<Operation>;
export declare function isImmutable(address: string, provider: PublicProvider, final?: boolean): Promise<boolean>;
