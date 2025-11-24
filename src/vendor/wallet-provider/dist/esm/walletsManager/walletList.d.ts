import { WalletInterfaces } from './types';
import { Wallet } from '../wallet/interface';
import { WalletName } from '../wallet/types';
export declare const supportedWallets: WalletInterfaces;
export declare function getWallets(delay?: number): Promise<Wallet[]>;
export declare function getWallet(name: WalletName, delay?: number): Promise<Wallet | undefined>;
//# sourceMappingURL=walletList.d.ts.map