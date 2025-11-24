import { MSDeploySCParams, MSExecuteScParams } from './types';
import { Address, CallSCParams, EventFilter, Network, NodeStatusInfo, Operation, OperationOptions, OperationStatus, Provider, ReadSCData, ReadSCParams, SignedData, SignOptions, SmartContract, rpcTypes, ExecuteSCReadOnlyResult, ExecuteSCReadOnlyParams } from '@massalabs/massa-web3';
/**
 * This module contains the MassaStationAccount class. It is responsible for representing an account in
 * the MassaStation wallet.
 *
 * @remarks
 * This class provides methods to interact with MassaStation account's {@link balance} and to {@link sign} messages.
 *
 */
export declare class MassaStationAccount implements Provider {
    address: string;
    accountName: string;
    private _providerName;
    constructor(address: string, accountName: string);
    get providerName(): string;
    balance(final?: boolean): Promise<bigint>;
    balanceOf(addresses: string[], final?: boolean): Promise<{
        address: string;
        balance: bigint;
    }[]>;
    sign(data: Uint8Array | string, opts?: SignOptions): Promise<SignedData>;
    private minimalFee;
    private rollOperation;
    buyRolls(amount: bigint, opts?: OperationOptions): Promise<Operation>;
    sellRolls(amount: bigint, opts?: OperationOptions): Promise<Operation>;
    transfer(to: Address | string, amount: bigint, opts?: OperationOptions): Promise<Operation>;
    callSC(params: CallSCParams): Promise<Operation>;
    networkInfos(): Promise<Network>;
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    deploySC(params: MSDeploySCParams): Promise<SmartContract>;
    executeSC(params: MSExecuteScParams): Promise<Operation>;
    executeSCReadOnly(params: ExecuteSCReadOnlyParams): Promise<ExecuteSCReadOnlyResult>;
    getOperationStatus(opId: string): Promise<OperationStatus>;
    getEvents(filter: EventFilter): Promise<rpcTypes.OutputEvents>;
    getNodeStatus(): Promise<NodeStatusInfo>;
    getStorageKeys(address: string, filter?: Uint8Array | string, final?: boolean): Promise<Uint8Array[]>;
    readStorage(address: string, keys: Uint8Array[] | string[], final?: boolean): Promise<(Uint8Array | null)[]>;
}
//# sourceMappingURL=MassaStationAccount.d.ts.map