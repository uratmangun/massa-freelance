import { JsonRpcPublicProvider, PublicApiUrl, } from '@massalabs/massa-web3';
import { MASSA_STATION_URL } from '../MassaStationWallet';
import { getRequest } from '../RequestHandler';
import { isStandalone } from './standalone';
// Use client singleton to benefit from caching
let client;
// Use rpcUrl to check if node has changed
let rpcUrl;
export async function networkInfos() {
    if (isStandalone()) {
        rpcUrl = PublicApiUrl.Buildnet;
        client = JsonRpcPublicProvider.fromRPCUrl(rpcUrl);
        return client.networkInfos();
    }
    const { result } = await getRequest(`${MASSA_STATION_URL}massa/node`);
    const url = result.url;
    if (!client || rpcUrl !== url) {
        client = JsonRpcPublicProvider.fromRPCUrl(url);
        rpcUrl = url;
    }
    return client.networkInfos();
}
export async function getClient() {
    if (!client) {
        // this initialize client
        await networkInfos();
    }
    return client;
}
//# sourceMappingURL=network.js.map