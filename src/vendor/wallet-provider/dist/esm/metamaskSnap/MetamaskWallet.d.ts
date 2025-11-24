import { Wallet } from '../wallet/interface';
import { Network, Provider } from '@massalabs/massa-web3';
import { WalletName } from '../wallet';
import { MetamaskAccount } from './MetamaskAccount';
import { MetaMaskInpageProvider } from '@metamask/providers';
export declare class MetamaskWallet implements Wallet {
    private walletName;
    private metamaskProvider;
    private eventsListener;
    private currentNetwork;
    name(): WalletName;
    constructor(provider: MetaMaskInpageProvider);
    static createIfInstalled(): Promise<Wallet | null>;
    accounts(): Promise<MetamaskAccount[]>;
    importAccount(): Promise<void>;
    deleteAccount(): Promise<void>;
    networkInfos(): Promise<Network>;
    /**
     * Sets the RPC URL for the MetaMask provider.
     *
     * @param url - The new RPC URL.
     * @returns A promise that resolves when the RPC URL is updated.
     */
    setRpcUrl(url: string): Promise<void>;
    generateNewAccount(): Promise<Provider>;
    listenAccountChanges(): {
        unsubscribe: () => void;
    } | undefined;
    /**
     * Subscribes to network changes.
     *
     * @param callback - Callback function called when the network changes.
     * @returns An object with an `unsubscribe` method to stop listening.
     * @remarks Periodically checks for network changes every 500ms.
     *
     * @example
     * ```typescript
     * const observer = await provider.listenNetworkChanges((network) => {
     *   console.log(network);
     * });
     * observer.unsubscribe();
     * ```
     */
    listenNetworkChanges(callback: (network: Network) => void): {
        unsubscribe: () => void;
    } | undefined;
    /**
     * Connects to MetaMask and ensures it is unlocked and ready.
     *
     * @returns A promise that resolves to `true` if connected successfully, otherwise `false`.
     */
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    connected(): Promise<boolean>;
    enabled(): boolean;
}
//# sourceMappingURL=MetamaskWallet.d.ts.map