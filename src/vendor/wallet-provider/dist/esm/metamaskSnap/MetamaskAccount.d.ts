import { MetaMaskInpageProvider } from '@metamask/providers';
import { Address, CallSCParams, DeploySCParams, EventFilter, Network, NodeStatusInfo, Operation, OperationOptions, OperationStatus, Provider, ReadSCData, ReadSCParams, SignedData, SmartContract, rpcTypes, ExecuteScParams, ExecuteSCReadOnlyParams, ExecuteSCReadOnlyResult } from '@massalabs/massa-web3';
export declare class MetamaskAccount implements Provider {
    readonly address: string;
    private readonly provider;
    constructor(address: string, provider: MetaMaskInpageProvider);
    get accountName(): string;
    get providerName(): string;
    balance(final?: boolean): Promise<bigint>;
    balanceOf(addresses: string[], final?: boolean): Promise<{
        address: string;
        balance: bigint;
    }[]>;
    networkInfos(): Promise<Network>;
    sign(inData: Uint8Array | string): Promise<SignedData>;
    private handleRollOperation;
    buyRolls(amount: bigint, opts?: OperationOptions): Promise<Operation>;
    sellRolls(amount: bigint, opts?: OperationOptions): Promise<Operation>;
    transfer(to: Address | string, amount: bigint, opts?: OperationOptions): Promise<Operation>;
    callSC(params: CallSCParams): Promise<Operation>;
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    deploySC(params: DeploySCParams): Promise<SmartContract>;
    getOperationStatus(opId: string): Promise<OperationStatus>;
    getEvents(filter: EventFilter): Promise<rpcTypes.OutputEvents>;
    getNodeStatus(): Promise<NodeStatusInfo>;
    getStorageKeys(address: string, filter?: Uint8Array | string, final?: boolean): Promise<Uint8Array[]>;
    readStorage(address: string, keys: Uint8Array[] | string[], final?: boolean): Promise<(Uint8Array | null)[]>;
    executeSC(params: ExecuteScParams): Promise<Operation>;
    executeSCReadOnly(params: ExecuteSCReadOnlyParams): Promise<ExecuteSCReadOnlyResult>;
}
//# sourceMappingURL=MetamaskAccount.d.ts.map