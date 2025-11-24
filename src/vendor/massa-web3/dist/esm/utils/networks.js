/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-magic-numbers */
export var PublicApiUrl;
(function (PublicApiUrl) {
    PublicApiUrl["Mainnet"] = "https://mainnet.massa.net/api/v2";
    PublicApiUrl["Testnet"] = "https://testnet.massa.net/api/v2";
    PublicApiUrl["Buildnet"] = "https://buildnet.massa.net/api/v2";
})(PublicApiUrl || (PublicApiUrl = {}));
export var GrpcApiUrl;
(function (GrpcApiUrl) {
    GrpcApiUrl["Mainnet"] = "https://mainnet.massa.net:33037";
    GrpcApiUrl["Buildnet"] = "https://buildnet.massa.net/api/grpc";
})(GrpcApiUrl || (GrpcApiUrl = {}));
export var NetworkName;
(function (NetworkName) {
    NetworkName["Mainnet"] = "mainnet";
    NetworkName["Testnet"] = "testnet";
    NetworkName["Buildnet"] = "buildnet";
})(NetworkName || (NetworkName = {}));
export const CHAIN_ID = {
    Mainnet: 77658377n,
    Testnet: 77658376n,
    Buildnet: 77658366n,
};
export function getNetworkNameByChainId(chainId) {
    for (const [key, value] of Object.entries(CHAIN_ID)) {
        if (value === chainId) {
            return NetworkName[key];
        }
    }
    return undefined;
}
export function getPublicApiByChainId(chainId) {
    for (const [key, value] of Object.entries(CHAIN_ID)) {
        if (value === chainId) {
            return PublicApiUrl[key];
        }
    }
    return undefined;
}
