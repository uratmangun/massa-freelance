import { PublicApiUrl } from '..';
import { PublicAPI } from './publicAPI';
export class JsonRPCClient extends PublicAPI {
    static buildnet() {
        return new JsonRPCClient(PublicApiUrl.Buildnet);
    }
    static testnet() {
        return new JsonRPCClient(PublicApiUrl.Testnet);
    }
    static mainnet() {
        return new JsonRPCClient(PublicApiUrl.Mainnet);
    }
}
