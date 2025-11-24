import { JsonRpcPublicProvider, getNetworkNameByChainId, } from '@massalabs/massa-web3';
import { getNetwork } from '../services/getNetwork';
// Use client singleton to benefit from caching
let client;
// Use rpcUrl to check if node has changed
let rpcUrl;
export async function networkInfos(metaMaskProvider) {
    const res = await getNetwork(metaMaskProvider);
    const url = res.rpcUrl;
    if (!client || rpcUrl !== url) {
        client = JsonRpcPublicProvider.fromRPCUrl(url);
        rpcUrl = url;
    }
    const networkName = getNetworkNameByChainId(BigInt(res.chainId));
    return {
        name: networkName ? networkName : '',
        chainId: BigInt(res.chainId),
        url,
        minimalFee: BigInt(res.minimalFees),
    };
}
export async function getClient(metaMaskProvider) {
    if (!client) {
        // this initialize client
        await networkInfos(metaMaskProvider);
    }
    return client;
}
//# sourceMappingURL=network.js.map