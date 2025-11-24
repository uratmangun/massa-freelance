import { WalletName } from '../wallet';
import { getMetamaskProvider } from './metamask';
import { connectSnap, isConnected } from './snap';
import { MetamaskAccount } from './MetamaskAccount';
import { getActiveAccount, setRpcUrl } from './services';
import { networkInfos } from './utils/network';
import EventEmitter from 'eventemitter3';
const METAMASK_NETWORK_CHANGED = 'METAMASK_NETWORK_CHANGED';
export class MetamaskWallet {
    walletName = WalletName.Metamask;
    metamaskProvider;
    eventsListener = new EventEmitter();
    currentNetwork;
    name() {
        return this.walletName;
    }
    constructor(provider) {
        this.metamaskProvider = provider;
    }
    static async createIfInstalled() {
        try {
            const metamask = await getMetamaskProvider();
            if (!metamask)
                return null;
            return new MetamaskWallet(metamask);
        }
        catch (error) {
            return null;
        }
    }
    async accounts() {
        const res = await getActiveAccount(this.metamaskProvider);
        return [new MetamaskAccount(res.address, this.metamaskProvider)];
    }
    async importAccount() {
        throw new Error('Method not implemented.');
    }
    async deleteAccount() {
        throw new Error('Method not implemented.');
    }
    async networkInfos() {
        return networkInfos(this.metamaskProvider);
    }
    /**
     * Sets the RPC URL for the MetaMask provider.
     *
     * @param url - The new RPC URL.
     * @returns A promise that resolves when the RPC URL is updated.
     */
    async setRpcUrl(url) {
        await setRpcUrl(this.metamaskProvider, { network: url });
    }
    async generateNewAccount() {
        throw new Error('Method not implemented.');
    }
    listenAccountChanges() {
        throw new Error('listenAccountChanges is not yet implemented for the current provider.');
    }
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
    listenNetworkChanges(callback) {
        this.eventsListener.on(METAMASK_NETWORK_CHANGED, (evt) => callback(evt));
        const intervalId = setInterval(async () => {
            const network = await this.networkInfos();
            if (!this.currentNetwork) {
                this.currentNetwork = network;
                return;
            }
            if (this.currentNetwork.name !== network.name) {
                this.currentNetwork = network;
                this.eventsListener.emit(METAMASK_NETWORK_CHANGED, network);
            }
        }, 500);
        return {
            unsubscribe: () => {
                clearInterval(intervalId);
                this.eventsListener.removeListener(METAMASK_NETWORK_CHANGED, 
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => { });
            },
        };
    }
    /**
     * Connects to MetaMask and ensures it is unlocked and ready.
     *
     * @returns A promise that resolves to `true` if connected successfully, otherwise `false`.
     */
    async connect() {
        try {
            const connected = await isConnected(this.metamaskProvider);
            if (!connected) {
                await connectSnap(this.metamaskProvider);
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async disconnect() {
        throw new Error('Method not implemented.');
    }
    connected() {
        return isConnected(this.metamaskProvider);
    }
    enabled() {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=MetamaskWallet.js.map