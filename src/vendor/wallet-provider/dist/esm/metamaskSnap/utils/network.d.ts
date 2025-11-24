import { JsonRpcPublicProvider, Network } from '@massalabs/massa-web3';
import { MetaMaskInpageProvider } from '@metamask/providers';
export declare function networkInfos(metaMaskProvider: MetaMaskInpageProvider): Promise<Network>;
export declare function getClient(metaMaskProvider: MetaMaskInpageProvider): Promise<JsonRpcPublicProvider>;
//# sourceMappingURL=network.d.ts.map