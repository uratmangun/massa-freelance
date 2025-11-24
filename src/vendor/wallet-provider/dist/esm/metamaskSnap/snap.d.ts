import type { MetaMaskInpageProvider } from '@metamask/providers';
import { type GetSnapsResponse, Snap } from './types';
export declare const getInstalledSnaps: (provider: MetaMaskInpageProvider) => Promise<GetSnapsResponse>;
export declare const getMassaSnapInfo: (provider: MetaMaskInpageProvider, version?: string) => Promise<Snap | undefined>;
export declare const isConnected: (provider: MetaMaskInpageProvider) => Promise<boolean>;
export declare const connectSnap: (provider: MetaMaskInpageProvider, params?: Record<'version' | string, unknown>) => Promise<import("@metamask/providers/dist/utils.cjs").Maybe<unknown>>;
export declare const showPrivateKey: (provider: MetaMaskInpageProvider) => Promise<import("@metamask/providers/dist/utils.cjs").Maybe<unknown>>;
//# sourceMappingURL=snap.d.ts.map