import { BearbyAccount } from './BearbyAccount';
import { Wallet } from '../wallet/interface';
import { Network, Provider } from '@massalabs/massa-web3';
import { WalletName } from '../wallet';
export declare class BearbyWallet implements Wallet {
    private walletName;
    name(): WalletName;
    static createIfInstalled(): Promise<Wallet | null>;
    accounts(): Promise<BearbyAccount[]>;
    importAccount(): Promise<void>;
    deleteAccount(): Promise<void>;
    networkInfos(): Promise<Network>;
    setRpcUrl(): Promise<void>;
    generateNewAccount(): Promise<Provider>;
    /**
     * Subscribes to account changes.
     *
     * @param callback - Callback to be called when the account changes.
     *
     * @returns A promise that resolves to a function that can be called to unsubscribe.
     *
     * @remarks
     * Don't forget to unsubscribe to avoid memory leaks.
     *
     * @example
     * ```typescript
     * // Subscribe
     * const observer = await provider.listenAccountChanges((base58) => {
     *  console.log(base58);
     * });
     *
     * // Unsubscribe
     * observer.unsubscribe();
     * ```
     */
    listenAccountChanges(callback: (address: string) => void): {
        unsubscribe: () => void;
    };
    /**
     * Subscribes to network changes.
     *
     * @param callback - Callback to be called when the network changes.
     *
     * @returns A promise that resolves to a function that can be called to unsubscribe.
     *
     * @remarks
     * Don't forget to unsubscribe to avoid memory leaks.
     *
     * @example
     * ```typescript
     * // Subscribe
     * const observer = await provider.listenNetworkChanges((network) => {
     *  console.log(network);
     * });
     *
     * // Unsubscribe
     * observer.unsubscribe();
     * ```
     */
    listenNetworkChanges(callback: (network: Network) => void): {
        unsubscribe: () => void;
    };
    /**
     * Connects to the wallet.
     *
     * @remarks
     * This method will attempt to establish a connection with the wallet.
     * If the connection fails, it will log the error message.
     */
    connect(): Promise<boolean>;
    /**
     * Disconnects from the wallet.
     *
     * @remarks
     * This method will attempt to disconnect from the wallet.
     * If the disconnection fails, it will log the error message.
     */
    disconnect(): Promise<boolean>;
    /**
     * Checks if the wallet is connected.
     *
     * @returns a boolean indicating whether the wallet is connected.
     */
    connected(): Promise<boolean>;
    /**
     * Checks if the wallet is enabled.
     *
     * @returns a boolean indicating whether the wallet is enabled.
     */
    enabled(): boolean;
}
//# sourceMappingURL=BearbyWallet.d.ts.map