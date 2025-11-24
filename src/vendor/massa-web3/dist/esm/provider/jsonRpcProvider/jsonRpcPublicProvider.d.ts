import { NodeStatusInfo, PublicProvider, ReadSCData, ReadSCParams } from '..';
import { EventFilter, ExecuteSCReadOnlyParams, ExecuteSCReadOnlyResult, Network, PublicAPI } from '../..';
import { rpcTypes as t } from '../../generated';
import { OperationStatus } from '../../operation';
import { U64_t } from '../../basicElements/serializers/number/u64';
export declare class JsonRpcPublicProvider implements PublicProvider {
    client: PublicAPI;
    constructor(client: PublicAPI);
    static fromRPCUrl(url: string): PublicProvider;
    static mainnet(): PublicProvider;
    static buildnet(): PublicProvider;
    balanceOf(addresses: string[], final?: boolean): Promise<{
        address: string;
        balance: bigint;
    }[]>;
    networkInfos(): Promise<Network>;
    getOperationStatus(opId: string): Promise<OperationStatus>;
    getEvents(filter: EventFilter): Promise<t.OutputEvents>;
    getNodeStatus(): Promise<NodeStatusInfo>;
    /**
     * Reads smart contract function.
     * @param params - readSCParams.
     * @returns A promise that resolves to a ReadSCData.
     *
     * @remarks Be a aware that if you don't provide a caller address, it will generate a random one.
     */
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    getStorageKeys(address: string, filter?: Uint8Array | string, final?: boolean): Promise<Uint8Array[]>;
    readStorage(address: string, keys: Uint8Array[] | string[], final?: boolean): Promise<(Uint8Array | null)[]>;
    /**
     * Returns the gas estimation for a given function.
     *
     * @remarks To avoid running out of gas, the gas estimation is increased by 20%.
     *
     * @param params - ReadSCParams. caller must be provided
     * @throws If the read operation returns an error.
     * @returns The gas estimation for the operation execution.
     */
    getGasEstimation(params: ReadSCParams): Promise<U64_t>;
    executeSCReadOnly(params: ExecuteSCReadOnlyParams): Promise<ExecuteSCReadOnlyResult>;
    executeSCGasEstimation(params: ExecuteSCReadOnlyParams): Promise<U64_t>;
}
