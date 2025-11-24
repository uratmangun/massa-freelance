export declare enum PublicApiUrl {
    Mainnet = "https://mainnet.massa.net/api/v2",
    Testnet = "https://testnet.massa.net/api/v2",
    Buildnet = "https://buildnet.massa.net/api/v2"
}
export declare enum GrpcApiUrl {
    Mainnet = "https://mainnet.massa.net:33037",
    Buildnet = "https://buildnet.massa.net/api/grpc"
}
export declare enum NetworkName {
    Mainnet = "mainnet",
    Testnet = "testnet",
    Buildnet = "buildnet"
}
export declare const CHAIN_ID: {
    Mainnet: bigint;
    Testnet: bigint;
    Buildnet: bigint;
};
export declare function getNetworkNameByChainId(chainId: bigint): NetworkName | undefined;
export declare function getPublicApiByChainId(chainId: bigint): PublicApiUrl | undefined;
export type Network = {
    name: NetworkName | string;
    chainId: bigint;
    url?: string;
    minimalFee: bigint;
};
