import { PublicAPI } from './publicAPI';
export declare class JsonRPCClient extends PublicAPI {
    static buildnet(): JsonRPCClient;
    static testnet(): JsonRPCClient;
    static mainnet(): JsonRPCClient;
}
