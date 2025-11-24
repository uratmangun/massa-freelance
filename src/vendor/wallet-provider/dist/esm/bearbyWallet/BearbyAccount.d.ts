import { Address, CallSCParams, DeploySCParams, EventFilter, Network, NodeStatusInfo, Operation, OperationOptions, OperationStatus, Provider, ReadSCData, ReadSCParams, SignedData, SmartContract, rpcTypes, ExecuteScParams, ExecuteSCReadOnlyParams, ExecuteSCReadOnlyResult } from '@massalabs/massa-web3';
export declare class BearbyAccount implements Provider {
    address: string;
    constructor(address: string);
    get accountName(): string;
    get providerName(): string;
    private getClient;
    balance(final?: boolean): Promise<bigint>;
    balanceOf(addresses: string[], final?: boolean): Promise<{
        address: string;
        balance: bigint;
    }[]>;
    networkInfos(): Promise<Network>;
    sign(data: Uint8Array | string): Promise<SignedData>;
    buyRolls(amount: bigint, _opts?: OperationOptions): Promise<Operation>;
    sellRolls(amount: bigint, _opts?: OperationOptions): Promise<Operation>;
    transfer(to: Address | string, amount: bigint, _opts?: OperationOptions): Promise<Operation>;
    private minimalFee;
    callSC(params: CallSCParams): Promise<Operation>;
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    deploySC(params: DeploySCParams): Promise<SmartContract>;
    executeSC(params: ExecuteScParams): Promise<Operation>;
    executeSCReadOnly(params: ExecuteSCReadOnlyParams): Promise<ExecuteSCReadOnlyResult>;
    getOperationStatus(opId: string): Promise<OperationStatus>;
    getEvents(filter: EventFilter): Promise<rpcTypes.OutputEvents>;
    getNodeStatus(): Promise<NodeStatusInfo>;
    getStorageKeys(address: string, filter?: Uint8Array | string, final?: boolean): Promise<Uint8Array[]>;
    readStorage(address: string, keys: Uint8Array[] | string[], final?: boolean): Promise<Uint8Array[]>;
}
//# sourceMappingURL=BearbyAccount.d.ts.map