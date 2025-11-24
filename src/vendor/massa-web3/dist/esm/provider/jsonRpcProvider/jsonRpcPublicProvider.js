import { GAS_ESTIMATION_TOLERANCE, } from '..';
import { Account, CHAIN_ID, Mas, MAX_GAS_CALL, MAX_GAS_EXECUTE, minBigInt, NetworkName, parseCallArgs, PublicAPI, PublicApiUrl, strToBytes, } from '../..';
import { formatNodeStatusObject } from '../../client/formatObjects';
export class JsonRpcPublicProvider {
    client;
    constructor(client) {
        this.client = client;
    }
    static fromRPCUrl(url) {
        return new JsonRpcPublicProvider(new PublicAPI(url));
    }
    static mainnet() {
        return JsonRpcPublicProvider.fromRPCUrl(PublicApiUrl.Mainnet);
    }
    static buildnet() {
        return JsonRpcPublicProvider.fromRPCUrl(PublicApiUrl.Buildnet);
    }
    async balanceOf(addresses, final = true) {
        const addressesInfo = await this.client.getMultipleAddressInfo(addresses);
        const balances = addressesInfo.map((addressInfo) => ({
            address: addressInfo.address,
            balance: final
                ? Mas.fromString(addressInfo.final_balance)
                : Mas.fromString(addressInfo.candidate_balance),
        }));
        return balances;
    }
    async networkInfos() {
        const chainId = await this.client.getChainId();
        let name = 'Unknown';
        if (chainId === CHAIN_ID.Mainnet) {
            name = NetworkName.Mainnet;
        }
        else if (chainId === CHAIN_ID.Buildnet) {
            name = NetworkName.Buildnet;
        }
        return {
            name,
            chainId,
            url: this.client.url,
            minimalFee: await this.client.getMinimalFee(),
        };
    }
    async getOperationStatus(opId) {
        return this.client.getOperationStatus(opId);
    }
    async getEvents(filter) {
        return this.client.getEvents(filter);
    }
    async getNodeStatus() {
        const status = await this.client.status();
        return formatNodeStatusObject(status);
    }
    /**
     * Reads smart contract function.
     * @param params - readSCParams.
     * @returns A promise that resolves to a ReadSCData.
     *
     * @remarks Be a aware that if you don't provide a caller address, it will generate a random one.
     */
    async readSC(params) {
        const parameter = parseCallArgs(params.parameter);
        const caller = params.caller ?? (await Account.generate()).address.toString();
        const readOnlyParams = {
            ...params,
            caller,
            parameter,
        };
        return this.client.executeReadOnlyCall(readOnlyParams);
    }
    async getStorageKeys(address, filter = new Uint8Array(), final = true) {
        const filterBytes = typeof filter === 'string' ? strToBytes(filter) : filter;
        return this.client.getDataStoreKeys(address, filterBytes, final);
    }
    async readStorage(address, keys, final = true) {
        const entries = keys.map((key) => ({ address, key }));
        return this.client.getDatastoreEntries(entries, final);
    }
    /**
     * Returns the gas estimation for a given function.
     *
     * @remarks To avoid running out of gas, the gas estimation is increased by 20%.
     *
     * @param params - ReadSCParams. caller must be provided
     * @throws If the read operation returns an error.
     * @returns The gas estimation for the operation execution.
     */
    async getGasEstimation(params) {
        if (!params.caller) {
            throw new Error('Caller must be provided for gas estimation');
        }
        const result = await this.readSC(params);
        if (result.info.error) {
            throw new Error(result.info.error);
        }
        // TODO: add coins estimation by analysing the stateChanges
        const gasCost = BigInt(result.info.gasCost);
        return minBigInt(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        gasCost + (gasCost * GAS_ESTIMATION_TOLERANCE) / 100n, MAX_GAS_CALL);
    }
    async executeSCReadOnly(params) {
        const caller = 
        // Use randomly chosen address that exists on buildnet & mainnet.
        // this is a workaround for the https://github.com/massalabs/massa/issues/4912
        params.caller ?? 'AU1bfnCAQAhPT2gAcJkL31fCWJixFFtH7RjRHZsvaThVoeNUckep';
        // params.caller ?? (await Account.generate()).address.toString()
        const result = await this.client.executeReadOnlyBytecode({
            ...params,
            caller,
        });
        if (result.error) {
            throw new Error(result.error);
        }
        return result;
    }
    async executeSCGasEstimation(params) {
        const result = await this.client.executeReadOnlyBytecode({
            ...params,
            maxGas: MAX_GAS_EXECUTE,
        });
        if (result.error) {
            throw new Error(result.error);
        }
        // TODO: add coins estimation by analysing the stateChanges
        const gasCost = BigInt(result.gasCost);
        return minBigInt(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        gasCost + (gasCost * GAS_ESTIMATION_TOLERANCE) / 100n, MAX_GAS_EXECUTE);
    }
}
