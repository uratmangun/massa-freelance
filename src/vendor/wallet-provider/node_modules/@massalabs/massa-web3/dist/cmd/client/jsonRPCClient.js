"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRPCClient = void 0;
const __1 = require("..");
const publicAPI_1 = require("./publicAPI");
class JsonRPCClient extends publicAPI_1.PublicAPI {
    static buildnet() {
        return new JsonRPCClient(__1.PublicApiUrl.Buildnet);
    }
    static testnet() {
        return new JsonRPCClient(__1.PublicApiUrl.Testnet);
    }
    static mainnet() {
        return new JsonRPCClient(__1.PublicApiUrl.Mainnet);
    }
}
exports.JsonRPCClient = JsonRPCClient;
