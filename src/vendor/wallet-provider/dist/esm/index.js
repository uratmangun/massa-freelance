/** Polyfills */
import { Buffer } from 'buffer';
// Check if we are on browser
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}
export var AvailableCommands;
(function (AvailableCommands) {
    AvailableCommands["ProviderListAccounts"] = "LIST_ACCOUNTS";
    AvailableCommands["ProviderDeleteAccount"] = "DELETE_ACCOUNT";
    AvailableCommands["ProviderImportAccount"] = "IMPORT_ACCOUNT";
    AvailableCommands["ProviderGetNodesUrls"] = "GET_NODES_URLS";
    AvailableCommands["ProviderGetNetwork"] = "GET_NETWORK";
    AvailableCommands["ProviderGetChainId"] = "GET_CHAIN_ID";
    AvailableCommands["AccountBalance"] = "ACCOUNT_BALANCE";
    AvailableCommands["AccountSign"] = "ACCOUNT_SIGN";
    AvailableCommands["ProviderGenerateNewAccount"] = "GENERATE_NEW_ACCOUNT";
    AvailableCommands["AccountSellRolls"] = "ACCOUNT_SELL_ROLLS";
    AvailableCommands["AccountBuyRolls"] = "ACCOUNT_BUY_ROLLS";
    AvailableCommands["AccountSendTransaction"] = "ACCOUNT_SEND_TRANSACTION";
    AvailableCommands["AccountCallSC"] = "ACCOUNT_CALL_SC";
})(AvailableCommands || (AvailableCommands = {}));
export * from './errors';
export { MassaStationWallet } from './massaStation/MassaStationWallet';
export { MassaStationAccount } from './massaStation/MassaStationAccount';
export { getWallet, getWallets, WalletsListener } from './walletsManager';
export * from './wallet';
export { isMassaStationAvailable, isMassaWalletEnabled, } from './massaStation/MassaStationDiscovery';
export { RuleType, } from './massaStation/types';
//# sourceMappingURL=index.js.map