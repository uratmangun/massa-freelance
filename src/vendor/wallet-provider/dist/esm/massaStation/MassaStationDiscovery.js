import { MASSA_STATION_URL } from './MassaStationWallet';
import { getRequest } from './RequestHandler';
// Constants for URLs and plugin information
const PLUGIN_NAME = 'Massa Wallet';
const PLUGIN_AUTHOR = 'Massa Labs';
const TIMEOUT = 4000;
async function fetchPluginData() {
    return getRequest(MASSA_STATION_URL + 'plugin-manager', TIMEOUT);
}
function findWalletPlugin(plugins) {
    return plugins.find((plugin) => plugin.name === PLUGIN_NAME && plugin.author === PLUGIN_AUTHOR);
}
export async function isMassaStationAvailable() {
    try {
        await fetchPluginData();
        return true;
    }
    catch (_) {
        return false;
    }
}
export async function isMassaWalletEnabled() {
    try {
        const { result } = await fetchPluginData();
        const walletPlugin = findWalletPlugin(result);
        return !!walletPlugin && walletPlugin.status === 'Up';
    }
    catch (_) {
        return false;
    }
}
//# sourceMappingURL=MassaStationDiscovery.js.map