import { deleteRequest, getRequest, postRequest, putRequest, } from './RequestHandler';
import { MassaStationAccount } from './MassaStationAccount';
import { MassaStationAccountStatus, } from './types';
import { EventEmitter } from 'eventemitter3';
import { networkInfos } from './utils/network';
import { WalletName } from '../wallet';
import { isMassaWalletEnabled } from './MassaStationDiscovery';
import { isStandalone } from './utils/standalone';
/**
 * MassaStation url
 */
export const MASSA_STATION_URL = 'https://station.massa/';
/**
 * The MassaStation accounts url
 */
export function walletApiUrl() {
    // This is a hack to detect that MS wallet is working in standalone mode
    if (isStandalone()) {
        return `http://localhost:8080/api`;
    }
    return `${MASSA_STATION_URL}plugin/massa-labs/massa-wallet/api`;
}
/**
 * Events emitted by MassaStation
 */
const MASSA_STATION_NETWORK_CHANGED = 'MASSA_STATION_NETWORK_CHANGED';
/**
 * This class provides an implementation for communicating with the MassaStation wallet.
 * @remarks
 * This class is used as a proxy to the MassaStation server for exchanging message over https calls.
 */
export class MassaStationWallet {
    walletName = WalletName.MassaWallet;
    eventsListener = new EventEmitter();
    currentNetwork;
    name() {
        return this.walletName;
    }
    static async createIfInstalled() {
        if (isStandalone() || (await isMassaWalletEnabled())) {
            return new MassaStationWallet();
        }
        return null;
    }
    async accounts() {
        const res = await getRequest(walletApiUrl() + '/accounts');
        return res.result
            .filter((account) => {
            return account.status === MassaStationAccountStatus.OK;
        })
            .map((account) => {
            return new MassaStationAccount(account.address, account.nickname);
        });
    }
    async importAccount(publicKey, privateKey) {
        await putRequest(walletApiUrl() + '/accounts', {
            publicKey,
            privateKey,
        });
    }
    async deleteAccount(address) {
        // get all accounts and find the account to delete
        const allAccounts = await getRequest(walletApiUrl() + '/accounts');
        const accountToDelete = allAccounts.result.find((account) => account.address === address);
        if (!accountToDelete) {
            throw new Error('Account not found');
        }
        await deleteRequest(`${walletApiUrl()}/accounts/${accountToDelete.nickname}`);
    }
    async networkInfos() {
        return networkInfos();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setRpcUrl(url) {
        throw new Error('setRpcUrl is not yet implemented for the current provider.');
    }
    /**
     * This method sends an http call to the MassaStation server to create a new random account.
     *
     * @returns a Promise that resolves to the details of the newly generated account.
     */
    async generateNewAccount(name) {
        const response = await postRequest(walletApiUrl() + '/accounts/' + name, {});
        return new MassaStationAccount(response.result.address, response.result.nickname);
    }
    listenAccountChanges() {
        throw new Error('listenAccountChanges is not yet implemented for the current provider.');
    }
    listenNetworkChanges(callback) {
        this.eventsListener.on(MASSA_STATION_NETWORK_CHANGED, (evt) => callback(evt));
        // check periodically if network changed
        const intervalId = setInterval(async () => {
            const network = await this.networkInfos();
            if (!this.currentNetwork) {
                this.currentNetwork = network;
                return;
            }
            if (this.currentNetwork.name !== network.name) {
                this.currentNetwork = network;
                this.eventsListener.emit(MASSA_STATION_NETWORK_CHANGED, network);
            }
        }, 500);
        return {
            unsubscribe: () => {
                clearInterval(intervalId);
                this.eventsListener.removeListener(MASSA_STATION_NETWORK_CHANGED, 
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => { });
            },
        };
    }
    /**
     * Simulates connecting to the station.
     * This method always returns `true` because the station is inherently connected.
     */
    async connect() {
        return true;
    }
    /**
     * Simulates disconnecting from the station.
     * This method always returns `true` because the station cannot be disconnected.
     */
    async disconnect() {
        return true;
    }
    /**
     * Indicates if the station is connected.
     * Always returns `true` because the station is always connected when running.
     */
    async connected() {
        return true;
    }
    /**
     * Indicates if the station is enabled.
     * Always returns `true` because the station is always enabled by default.
     */
    enabled() {
        return true;
    }
    /**
     * Retrieves the configuration from the MS Wallet api.
     *
     * @returns The configuration of MS wallet.
     */
    async getConfig() {
        const { result } = await getRequest(walletApiUrl() + '/config');
        return result;
    }
    /**
     * Adds a new signing rule to the MassaStation wallet.
     *
     * @param accountName - The name of the account.
     * @param rule - The signing rule to add.
     * @param desc - Custom description of the new rule creation.
     * @returns A Promise that resolves when the rule is successfully added.
     */
    async addSignRule(accountName, rule, desc) {
        const { result } = await postRequest(walletApiUrl() + '/accounts/' + accountName + '/signrules', {
            description: desc,
            name: rule.name,
            ruleType: rule.ruleType,
            contract: rule.contract,
            enabled: rule.enabled,
            authorizedOrigin: rule.authorizedOrigin,
        });
        return result;
    }
    /**
     * Edits an existing signing rule in the MassaStation wallet.
     * Modifying the contract or ruleType will result in a new rule being created with a new Id.
     *
     * @param accountName - The name of the account.
     * @param rule - The updated signing rule.
     * @param desc - Custom description of the rule update.
     * @returns A Promise that resolves when the rule is successfully edited.
     */
    async editSignRule(accountName, rule, desc) {
        const { result } = await putRequest(walletApiUrl() + '/accounts/' + accountName + '/signrules/' + rule.id, {
            description: desc,
            name: rule.name,
            ruleType: rule.ruleType,
            contract: rule.contract,
            enabled: rule.enabled,
        });
        return result;
    }
    /**
     * Deletes a signing rule from the MassaStation wallet.
     *
     * @param accountName - The name of the account.
     * @param ruleId - The Id of the sign rule.
     * @returns A Promise that resolves when the rule is successfully deleted.
     */
    async deleteSignRule(accountName, ruleId) {
        await deleteRequest(walletApiUrl() + '/accounts/' + accountName + '/signrules/' + ruleId);
    }
}
//# sourceMappingURL=MassaStationWallet.js.map