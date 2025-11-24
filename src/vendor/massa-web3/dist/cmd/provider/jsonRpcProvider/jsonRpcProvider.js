"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Provider = exports.JsonRpcProvider = void 0;
const __1 = require("../..");
const generated_1 = require("../../generated");
const operation_1 = require("../../operation");
const operationManager_1 = require("../../operation/operationManager");
const errors_1 = require("../../errors");
const jsonRpcPublicProvider_1 = require("./jsonRpcPublicProvider");
class JsonRpcProvider extends jsonRpcPublicProvider_1.JsonRpcPublicProvider {
    client;
    account;
    constructor(client, account) {
        super(client);
        this.client = client;
        this.account = account;
    }
    static fromRPCUrl(url, account) {
        const client = new __1.PublicAPI(url);
        if (account) {
            return new JsonRpcProvider(client, account);
        }
        return new jsonRpcPublicProvider_1.JsonRpcPublicProvider(client);
    }
    static mainnet(account) {
        return account
            ? JsonRpcProvider.fromRPCUrl(__1.PublicApiUrl.Mainnet, account)
            : JsonRpcProvider.fromRPCUrl(__1.PublicApiUrl.Mainnet);
    }
    static buildnet(account) {
        return account
            ? JsonRpcProvider.fromRPCUrl(__1.PublicApiUrl.Buildnet, account)
            : JsonRpcProvider.fromRPCUrl(__1.PublicApiUrl.Buildnet);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _providerName = 'Massa Json Rpc provider';
    get accountName() {
        return this.account.address.toString();
    }
    get providerName() {
        return this._providerName;
    }
    get address() {
        return this.account.address.toString();
    }
    async balance(final = true) {
        return this.client.getBalance(this.address.toString(), final);
    }
    async rollOperation(type, amount, opts) {
        if (type !== operation_1.OperationType.RollBuy && type !== operation_1.OperationType.RollSell) {
            throw new Error('Invalid roll operation type.');
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (amount <= 0) {
            throw new Error('amount of rolls must be a positive non-zero value.');
        }
        const operation = new operationManager_1.OperationManager(this.account.privateKey, this.client);
        const details = {
            fee: opts?.fee ?? (await this.client.getMinimalFee()),
            expirePeriod: await (0, operationManager_1.getAbsoluteExpirePeriod)(this.client, opts?.periodToLive),
            type,
            amount,
        };
        const operationId = await operation.send(details);
        return new operation_1.Operation(this, operationId);
    }
    /**
     * Buys rolls.
     *
     * @param amount - The number of rolls to buy.
     * @param opts - Optional operation details.
     *
     * @returns The ID of the operation.
     * @throws If the amount of rolls is not a positive non-zero value.
     */
    async buyRolls(amount, opts) {
        return this.rollOperation(operation_1.OperationType.RollBuy, amount, opts);
    }
    /**
     * Sells rolls.
     *
     * @param amount - The number of rolls to sell.
     * @param opts - Optional operation details.
     *
     * @returns The ID of the operation.
     * @throws If the amount of rolls is not a positive non-zero value.
     */
    async sellRolls(amount, opts) {
        return this.rollOperation(operation_1.OperationType.RollSell, amount, opts);
    }
    /**
     * Transfers tokens.
     *
     * @param to - The address of the recipient.
     * @param amount - The amount of tokens to transfer.
     * @param opts - Optional operation details.
     *
     * @returns The ID of the operation.
     * @throws If the amount of tokens is not a positive non-zero value.
     */
    async transfer(to, amount, opts) {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (amount <= 0) {
            throw new Error('amount to transfer must be a positive non-zero value.');
        }
        if (typeof to === 'string') {
            to = __1.Address.fromString(to);
        }
        const operation = new operationManager_1.OperationManager(this.account.privateKey, this.client);
        const details = {
            fee: opts?.fee ?? (await this.client.getMinimalFee()),
            expirePeriod: await (0, operationManager_1.getAbsoluteExpirePeriod)(this.client, opts?.periodToLive),
            type: operation_1.OperationType.Transaction,
            amount,
            recipientAddress: to,
        };
        const operationId = await operation.send(details);
        return new operation_1.Operation(this, operationId);
    }
    async sign(data) {
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        const sig = await this.account.sign(bytes);
        return {
            publicKey: this.account.publicKey.toString(),
            signature: sig.toString(),
        };
    }
    async callSC(params) {
        const operationId = await this.call(params);
        return new operation_1.Operation(this, operationId);
    }
    /**
     * Executes Binary Smart Contract Code Onchain
     *
     * Executes a binary code (smart contract) directly on the blockchain without deploying or storing it.
     * This function is particularly useful for one-off actions or tasks that require blockchain execution
     * but do not need the persistence or state of a deployed smart contract.
     *
     * @remarks
     * If the execution involves storing data or spending coins, the sender's address (i.e., the user's address
     * initiating the contract execution) will be used.
     *
     * @see {@link https://docs.massa.net/docs/learn/operation-format-execution#executesc-operation-payload} for more details
     * on the setup and usage of the datastore during execution.
     */
    async executeSC(params) {
        let maxGas = params.maxGas;
        if (!maxGas) {
            maxGas = await this.executeSCGasEstimation(params);
        }
        else {
            if (maxGas > __1.MAX_GAS_EXECUTE) {
                throw new errors_1.ErrorMaxGas({ isHigher: true, amount: __1.MAX_GAS_EXECUTE });
            }
            else if (maxGas < __1.MIN_GAS_CALL) {
                throw new errors_1.ErrorMaxGas({ isHigher: false, amount: __1.MIN_GAS_CALL });
            }
        }
        const operationParams = {
            fee: params.fee ?? (await this.client.getMinimalFee()),
            expirePeriod: await (0, operationManager_1.getAbsoluteExpirePeriod)(this.client, params.periodToLive),
            type: operation_1.OperationType.ExecuteSmartContractBytecode,
            maxCoins: params.maxCoins ?? 0n,
            maxGas,
            contractDataBinary: params.byteCode,
            datastore: params.datastore,
        };
        const manager = new operationManager_1.OperationManager(this.account.privateKey, this.client);
        const operationId = await manager.send(operationParams);
        return new operation_1.Operation(this, operationId);
    }
    async deploySC(params) {
        const operation = await this.deploy(params);
        const deployedAddress = await operation.getDeployedAddress(params.waitFinalExecution);
        return new __1.SmartContract(this, deployedAddress);
    }
    /**
     * Executes a smart contract call operation
     * @param params - callSCParams.
     * @returns A promise that resolves to an Operation object representing the transaction.
     */
    async call(params) {
        const coins = params.coins ?? 0n;
        await this.checkAccountBalance(coins);
        const parameter = (0, __1.parseCallArgs)(params.parameter);
        const fee = params.fee ?? (await this.client.getMinimalFee());
        let maxGas = params.maxGas;
        if (!maxGas) {
            maxGas = await this.getGasEstimation(params);
        }
        else {
            if (maxGas > __1.MAX_GAS_CALL) {
                throw new errors_1.ErrorMaxGas({ isHigher: true, amount: __1.MAX_GAS_CALL });
            }
            else if (maxGas < __1.MIN_GAS_CALL) {
                throw new errors_1.ErrorMaxGas({ isHigher: false, amount: __1.MIN_GAS_CALL });
            }
        }
        const details = {
            fee,
            expirePeriod: await (0, operationManager_1.getAbsoluteExpirePeriod)(this.client, params.periodToLive),
            type: operation_1.OperationType.CallSmartContractFunction,
            coins,
            maxGas,
            address: params.target,
            func: params.func,
            parameter,
        };
        const manager = new operationManager_1.OperationManager(this.account.privateKey, this.client);
        return manager.send(details);
    }
    async checkAccountBalance(coins) {
        if (coins > 0n) {
            const balance = await this.client.getBalance(this.account.address.toString());
            if (balance < coins) {
                throw new errors_1.ErrorInsufficientBalance({
                    userBalance: balance,
                    neededBalance: coins,
                });
            }
        }
    }
    /**
     * Deploys a smart contract on the blockchain.
     *
     * @param params - Optional deployment details with defaults as follows:
     * @param params.fee - Execution fee, auto-estimated if absent.
     * @param params.maxCoins - Maximum number of coins to use, auto-estimated if absent.
     * @param params.maxGas - Maximum execution gas, auto-estimated if absent.
     * @param params.periodToLive - Duration in blocks before the transaction expires, defaults to 10.
     *
     * @returns The deployed smart contract.
     *
     * @throws If the account has insufficient balance to deploy the smart contract.
     */
    async deploy(params) {
        const coins = params.coins ?? 0n;
        const totalCost = __1.StorageCost.smartContractDeploy(params.byteCode.length) + coins;
        await this.checkAccountBalance(totalCost);
        const maxCoins = params.maxCoins ?? totalCost;
        const parameter = (0, __1.parseCallArgs)(params.parameter);
        const datastore = (0, __1.populateDatastore)([
            {
                data: params.byteCode,
                args: parameter,
                coins,
            },
        ]);
        return this.executeSC({
            ...params,
            byteCode: generated_1.DEPLOYER_BYTECODE,
            maxCoins,
            datastore,
        });
    }
    /**
     * Reads smart contract function.
     * @param params - readSCParams.
     * @returns A promise that resolves to a ReadSCData.
     */
    async readSC(params) {
        const caller = params.caller ?? this.account.address.toString();
        return super.readSC({
            ...params,
            caller,
        });
    }
    async getGasEstimation(params) {
        const caller = params.caller ?? this.account.address.toString();
        return super.getGasEstimation({ ...params, caller });
    }
    async executeSCReadOnly(params) {
        const caller = params.caller ?? this.account.address.toString();
        return super.executeSCReadOnly({
            ...params,
            caller,
        });
    }
    async executeSCGasEstimation(params) {
        const caller = params.caller ?? this.account.address.toString();
        return super.executeSCGasEstimation({ ...params, caller });
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
exports.Web3Provider = JsonRpcProvider;
