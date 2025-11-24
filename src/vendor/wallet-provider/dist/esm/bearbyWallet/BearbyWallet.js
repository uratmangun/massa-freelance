import { web3 } from '@hicaru/bearby.js';
import { BearbyAccount } from './BearbyAccount';
import { networkInfos } from './utils/network';
import { WalletName } from '../wallet';
export class BearbyWallet {
    walletName = WalletName.Bearby;
    name() {
        return this.walletName;
    }
    static async createIfInstalled() {
        if (web3.wallet.installed) {
            return new BearbyWallet();
        }
        return null;
    }
    async accounts() {
        // check if bearby is unlocked
        if (!web3.wallet.connected) {
            await web3.wallet.connect();
        }
        if (!web3.wallet.account.base58) {
            throw new Error('No account found on Bearby');
        }
        return [new BearbyAccount(web3.wallet.account.base58)];
    }
    async importAccount() {
        throw new Error('Method not implemented.');
    }
    async deleteAccount() {
        throw new Error('Method not implemented.');
    }
    async networkInfos() {
        if (!web3.wallet.connected) {
            await web3.wallet.connect();
        }
        return networkInfos();
    }
    async setRpcUrl() {
        throw new Error('setRpcUrl is not yet implemented for the current provider.');
    }
    async generateNewAccount() {
        throw new Error('Method not implemented.');
    }
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
    listenAccountChanges(callback) {
        return web3.wallet.account.subscribe((address) => address && callback(address));
    }
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
    listenNetworkChanges(callback) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return web3.wallet.network.subscribe((_) => networkInfos().then((network) => callback(network)));
    }
    /**
     * Connects to the wallet.
     *
     * @remarks
     * This method will attempt to establish a connection with the wallet.
     * If the connection fails, it will log the error message.
     */
    async connect() {
        return web3.wallet.connect();
    }
    /**
     * Disconnects from the wallet.
     *
     * @remarks
     * This method will attempt to disconnect from the wallet.
     * If the disconnection fails, it will log the error message.
     */
    async disconnect() {
        return web3.wallet.disconnect();
    }
    /**
     * Checks if the wallet is connected.
     *
     * @returns a boolean indicating whether the wallet is connected.
     */
    async connected() {
        return web3.wallet.connected;
    }
    /**
     * Checks if the wallet is enabled.
     *
     * @returns a boolean indicating whether the wallet is enabled.
     */
    enabled() {
        return web3.wallet.enabled;
    }
}
//# sourceMappingURL=BearbyWallet.js.map