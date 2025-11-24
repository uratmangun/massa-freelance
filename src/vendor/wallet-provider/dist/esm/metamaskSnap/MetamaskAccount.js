import { Operation, SmartContract, } from '@massalabs/massa-web3';
import { WalletName } from '../wallet';
import { errorHandler } from '../errors/utils/errorHandler';
import { operationType } from '../utils/constants';
import { networkInfos, getClient } from './utils/network';
import { buyRolls, callSC, deploySC, executeSC, getBalance, sellRolls, signMessage, transfer, } from './services';
export class MetamaskAccount {
    address;
    provider;
    constructor(address, provider) {
        this.address = address;
        this.provider = provider;
    }
    get accountName() {
        return this.address;
    }
    get providerName() {
        return WalletName.Metamask;
    }
    async balance(final = false) {
        const { finalBalance, candidateBalance } = await getBalance(this.provider, {
            address: this.address,
        });
        return BigInt(final ? finalBalance : candidateBalance);
    }
    async balanceOf(addresses, final = false) {
        const client = await getClient(this.provider);
        return client.balanceOf(addresses, final);
    }
    async networkInfos() {
        return networkInfos(this.provider);
    }
    async sign(inData) {
        try {
            const data = typeof inData === 'string' ? inData : Array.from(inData);
            const { publicKey, signature } = await signMessage(this.provider, {
                data,
            });
            return {
                publicKey,
                signature,
            };
        }
        catch (error) {
            throw errorHandler(operationType.Sign, error);
        }
    }
    async handleRollOperation(operation, amount, opts) {
        try {
            const params = {
                amount: amount.toString(),
            };
            if (opts?.fee) {
                params.fee = opts?.fee.toString();
            }
            const { operationId } = await (operation === 'buy'
                ? buyRolls(this.provider, params)
                : sellRolls(this.provider, params));
            return new Operation(this, operationId);
        }
        catch (error) {
            throw errorHandler(operation === 'buy' ? operationType.BuyRolls : operationType.SellRolls, error);
        }
    }
    async buyRolls(amount, opts) {
        return this.handleRollOperation('buy', amount, opts);
    }
    async sellRolls(amount, opts) {
        return this.handleRollOperation('sell', amount, opts);
    }
    async transfer(to, amount, opts) {
        try {
            const params = {
                amount: amount.toString(),
                recipientAddress: to.toString(),
            };
            if (opts?.fee) {
                params.fee = opts?.fee.toString();
            }
            const { operationId } = await transfer(this.provider, params);
            return new Operation(this, operationId);
        }
        catch (error) {
            throw errorHandler(operationType.SendTransaction, error);
        }
    }
    async callSC(params) {
        try {
            const callSCparams = {
                functionName: params.func,
                at: params.target,
            };
            if (params.parameter) {
                callSCparams.args =
                    params.parameter instanceof Uint8Array
                        ? Array.from(params.parameter)
                        : Array.from(params.parameter.serialize());
            }
            if (params.coins) {
                callSCparams.coins = params.coins.toString();
            }
            if (params.maxGas) {
                callSCparams.maxGas = params.maxGas.toString();
            }
            if (params.fee) {
                callSCparams.fee = params.fee.toString();
            }
            const { operationId } = await callSC(this.provider, callSCparams);
            return new Operation(this, operationId);
        }
        catch (error) {
            throw errorHandler(operationType.CallSC, error);
        }
    }
    async readSC(params) {
        try {
            const client = await getClient(this.provider);
            const readOnlyParams = {
                ...params,
                caller: params.caller ?? this.address,
            };
            return client.readSC(readOnlyParams);
        }
        catch (error) {
            throw new Error(`Smart contract read failed: ${error.message}`);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deploySC(params) {
        try {
            const deployParams = {
                bytecode: Array.from(params.byteCode),
            };
            if (params.parameter) {
                deployParams.args = Array.from(params.parameter instanceof Uint8Array
                    ? params.parameter
                    : params.parameter.serialize());
            }
            if (params.coins) {
                deployParams.coins = params.coins.toString();
            }
            if (params.maxGas) {
                deployParams.maxGas = params.maxGas.toString();
            }
            if (params.fee) {
                deployParams.fee = params.fee.toString();
            }
            if (params.maxCoins) {
                deployParams.maxCoins = params.maxCoins.toString();
            }
            const { operationId } = await deploySC(this.provider, deployParams);
            const op = new Operation(this, operationId);
            const deployedAddress = await op.getDeployedAddress(params.waitFinalExecution);
            return new SmartContract(this, deployedAddress);
        }
        catch (error) {
            throw errorHandler(operationType.DeploySC, error);
        }
    }
    async getOperationStatus(opId) {
        const client = await getClient(this.provider);
        return client.getOperationStatus(opId);
    }
    async getEvents(filter) {
        const client = await getClient(this.provider);
        return client.getEvents(filter);
    }
    async getNodeStatus() {
        const client = await getClient(this.provider);
        return client.getNodeStatus();
    }
    async getStorageKeys(address, filter = new Uint8Array(), final = true) {
        const client = await getClient(this.provider);
        return client.getStorageKeys(address, filter, final);
    }
    async readStorage(address, keys, final = true) {
        const client = await getClient(this.provider);
        return client.readStorage(address, keys, final);
    }
    async executeSC(params) {
        try {
            const executeParams = {
                bytecode: Array.from(params.byteCode),
            };
            if (params.datastore) {
                executeParams.datastore = Array.from(params.datastore.entries()).map(([key, value]) => ({
                    key: Array.from(key),
                    value: Array.from(value),
                }));
            }
            if (params.maxGas) {
                executeParams.maxGas = params.maxGas.toString();
            }
            if (params.fee) {
                executeParams.fee = params.fee.toString();
            }
            if (params.maxCoins) {
                executeParams.maxCoins = params.maxCoins.toString();
            }
            const { operationId } = await executeSC(this.provider, executeParams);
            return new Operation(this, operationId);
        }
        catch (error) {
            throw errorHandler(operationType.ExecuteSC, error);
        }
    }
    async executeSCReadOnly(params) {
        try {
            const readOnlyParams = {
                ...params,
                caller: params.caller ?? this.address,
            };
            const client = await getClient(this.provider);
            return client.executeSCReadOnly(readOnlyParams);
        }
        catch (error) {
            throw new Error(`Error during readonly smart contract bytecode execution: ${error}`);
        }
    }
}
//# sourceMappingURL=MetamaskAccount.js.map