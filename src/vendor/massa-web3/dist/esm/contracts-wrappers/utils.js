import { CHAIN_ID } from '../utils';
export function checkNetwork(provider, isMainnet) {
    provider.networkInfos().then((network) => {
        if (isMainnet && network.chainId !== CHAIN_ID.Mainnet) {
            console.warn('This contract is only available on mainnet');
        }
        else if (!isMainnet && network.chainId === CHAIN_ID.Mainnet) {
            console.warn('This contract is only available on buildnet');
        }
    });
}
