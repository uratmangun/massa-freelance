import { MassaStationAccount } from './MassaStationAccount';
import { AddUpdateSignRuleResponse, Config, SignRule } from './types';
import { Wallet } from '../wallet/interface';
import { Network } from '@massalabs/massa-web3';
import { WalletName } from '../wallet';
/**
 * MassaStation url
 */
export declare const MASSA_STATION_URL = "https://station.massa/";
/**
 * The MassaStation accounts url
 */
export declare function walletApiUrl(): string;
/**
 * This class provides an implementation for communicating with the MassaStation wallet.
 * @remarks
 * This class is used as a proxy to the MassaStation server for exchanging message over https calls.
 */
export declare class MassaStationWallet implements Wallet {
    private walletName;
    private eventsListener;
    private currentNetwork;
    name(): WalletName;
    static createIfInstalled(): Promise<Wallet | null>;
    accounts(): Promise<MassaStationAccount[]>;
    importAccount(publicKey: string, privateKey: string): Promise<void>;
    deleteAccount(address: string): Promise<void>;
    networkInfos(): Promise<Network>;
    setRpcUrl(url: string): Promise<void>;
    /**
     * This method sends an http call to the MassaStation server to create a new random account.
     *
     * @returns a Promise that resolves to the details of the newly generated account.
     */
    generateNewAccount(name: string): Promise<MassaStationAccount>;
    listenAccountChanges(): {
        unsubscribe: () => void;
    } | undefined;
    listenNetworkChanges(callback: (network: Network) => void): {
        unsubscribe: () => void;
    } | undefined;
    /**
     * Simulates connecting to the station.
     * This method always returns `true` because the station is inherently connected.
     */
    connect(): Promise<boolean>;
    /**
     * Simulates disconnecting from the station.
     * This method always returns `true` because the station cannot be disconnected.
     */
    disconnect(): Promise<boolean>;
    /**
     * Indicates if the station is connected.
     * Always returns `true` because the station is always connected when running.
     */
    connected(): Promise<boolean>;
    /**
     * Indicates if the station is enabled.
     * Always returns `true` because the station is always enabled by default.
     */
    enabled(): boolean;
    /**
     * Retrieves the configuration from the MS Wallet api.
     *
     * @returns The configuration of MS wallet.
     */
    getConfig(): Promise<Config>;
    /**
     * Adds a new signing rule to the MassaStation wallet.
     *
     * @param accountName - The name of the account.
     * @param rule - The signing rule to add.
     * @param desc - Custom description of the new rule creation.
     * @returns A Promise that resolves when the rule is successfully added.
     */
    addSignRule(accountName: string, rule: SignRule, desc?: string): Promise<AddUpdateSignRuleResponse>;
    /**
     * Edits an existing signing rule in the MassaStation wallet.
     * Modifying the contract or ruleType will result in a new rule being created with a new Id.
     *
     * @param accountName - The name of the account.
     * @param rule - The updated signing rule.
     * @param desc - Custom description of the rule update.
     * @returns A Promise that resolves when the rule is successfully edited.
     */
    editSignRule(accountName: string, rule: SignRule, desc?: string): Promise<AddUpdateSignRuleResponse>;
    /**
     * Deletes a signing rule from the MassaStation wallet.
     *
     * @param accountName - The name of the account.
     * @param ruleId - The Id of the sign rule.
     * @returns A Promise that resolves when the rule is successfully deleted.
     */
    deleteSignRule(accountName: string, ruleId: string): Promise<void>;
}
//# sourceMappingURL=MassaStationWallet.d.ts.map