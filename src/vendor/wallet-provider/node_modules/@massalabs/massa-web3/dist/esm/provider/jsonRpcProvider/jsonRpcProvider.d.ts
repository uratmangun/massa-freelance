import { CallSCParams, DeploySCParams, ExecuteScParams, Provider, ReadSCData, ReadSCParams, SignedData } from '..';
import { Account, Address, ExecuteSCReadOnlyParams, ExecuteSCReadOnlyResult, PublicAPI, SmartContract } from '../..';
import { Mas } from '../../basicElements/mas';
import { Operation, OperationOptions } from '../../operation';
import { JsonRpcPublicProvider } from './jsonRpcPublicProvider';
import { U64_t } from '../../basicElements/serializers/number/u64';
export declare class JsonRpcProvider extends JsonRpcPublicProvider implements Provider {
    client: PublicAPI;
    account: Account;
    constructor(client: PublicAPI, account: Account);
    static fromRPCUrl(url: string, account: Account): JsonRpcProvider;
    static fromRPCUrl(url: string): JsonRpcPublicProvider;
    static mainnet(account: Account): JsonRpcProvider;
    static mainnet(): JsonRpcPublicProvider;
    static buildnet(account: Account): JsonRpcProvider;
    static buildnet(): JsonRpcPublicProvider;
    private readonly _providerName;
    get accountName(): string;
    get providerName(): string;
    get address(): string;
    balance(final?: boolean): Promise<bigint>;
    private rollOperation;
    /**
     * Buys rolls.
     *
     * @param amount - The number of rolls to buy.
     * @param opts - Optional operation details.
     *
     * @returns The ID of the operation.
     * @throws If the amount of rolls is not a positive non-zero value.
     */
    buyRolls(amount: Mas, opts?: OperationOptions): Promise<Operation>;
    /**
     * Sells rolls.
     *
     * @param amount - The number of rolls to sell.
     * @param opts - Optional operation details.
     *
     * @returns The ID of the operation.
     * @throws If the amount of rolls is not a positive non-zero value.
     */
    sellRolls(amount: Mas, opts?: OperationOptions): Promise<Operation>;
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
    transfer(to: Address | string, amount: Mas, opts?: OperationOptions): Promise<Operation>;
    sign(data: Uint8Array | string): Promise<SignedData>;
    callSC(params: CallSCParams): Promise<Operation>;
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
    executeSC(params: ExecuteScParams): Promise<Operation>;
    deploySC(params: DeploySCParams): Promise<SmartContract>;
    /**
     * Executes a smart contract call operation
     * @param params - callSCParams.
     * @returns A promise that resolves to an Operation object representing the transaction.
     */
    protected call(params: CallSCParams): Promise<string>;
    protected checkAccountBalance(coins: Mas): Promise<void>;
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
    protected deploy(params: DeploySCParams): Promise<Operation>;
    /**
     * Reads smart contract function.
     * @param params - readSCParams.
     * @returns A promise that resolves to a ReadSCData.
     */
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    getGasEstimation(params: ReadSCParams): Promise<U64_t>;
    executeSCReadOnly(params: ExecuteSCReadOnlyParams): Promise<ExecuteSCReadOnlyResult>;
    executeSCGasEstimation(params: ExecuteSCReadOnlyParams): Promise<U64_t>;
}
export { JsonRpcProvider as Web3Provider };
