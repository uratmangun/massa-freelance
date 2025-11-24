"use strict";
/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-magic-numbers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicApiByChainId = exports.getNetworkNameByChainId = exports.CHAIN_ID = exports.NetworkName = exports.GrpcApiUrl = exports.PublicApiUrl = void 0;
var PublicApiUrl;
(function (PublicApiUrl) {
    PublicApiUrl["Mainnet"] = "https://mainnet.massa.net/api/v2";
    PublicApiUrl["Testnet"] = "https://testnet.massa.net/api/v2";
    PublicApiUrl["Buildnet"] = "https://buildnet.massa.net/api/v2";
})(PublicApiUrl || (exports.PublicApiUrl = PublicApiUrl = {}));
var GrpcApiUrl;
(function (GrpcApiUrl) {
    GrpcApiUrl["Mainnet"] = "https://mainnet.massa.net:33037";
    GrpcApiUrl["Buildnet"] = "https://buildnet.massa.net/api/grpc";
})(GrpcApiUrl || (exports.GrpcApiUrl = GrpcApiUrl = {}));
var NetworkName;
(function (NetworkName) {
    NetworkName["Mainnet"] = "mainnet";
    NetworkName["Testnet"] = "testnet";
    NetworkName["Buildnet"] = "buildnet";
})(NetworkName || (exports.NetworkName = NetworkName = {}));
exports.CHAIN_ID = {
    Mainnet: 77658377n,
    Testnet: 77658376n,
    Buildnet: 77658366n,
};
function getNetworkNameByChainId(chainId) {
    for (const [key, value] of Object.entries(exports.CHAIN_ID)) {
        if (value === chainId) {
            return NetworkName[key];
        }
    }
    return undefined;
}
exports.getNetworkNameByChainId = getNetworkNameByChainId;
function getPublicApiByChainId(chainId) {
    for (const [key, value] of Object.entries(exports.CHAIN_ID)) {
        if (value === chainId) {
            return PublicApiUrl[key];
        }
    }
    return undefined;
}
exports.getPublicApiByChainId = getPublicApiByChainId;
