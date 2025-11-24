import { Operation } from '../../operation';
import { SmartContract } from '../../smartContracts';
import { Provider, ReadSCData, ReadSCParams, SignedData } from '..';
import { Account } from '../../account';
import { GrpcPublicProvider } from './grpcPublicProvider';
import { PublicServiceClient } from '../../generated/grpc/PublicServiceClientPb';
/**
 * GrpcProvider implements the Provider interface using gRPC for Massa blockchain interactions
 */
export declare class GrpcProvider extends GrpcPublicProvider implements Provider {
    client: PublicServiceClient;
    url: string;
    private account;
    private readonly _providerName;
    /**
     * Creates a new GrpcProvider instance
     * @param url - The gRPC endpoint URL
     * @param account - The account associated with this provider
     */
    constructor(client: PublicServiceClient, url: string, account: Account);
    static mainnet(account: Account): GrpcProvider;
    static mainnet(): GrpcPublicProvider;
    static buildnet(account: Account): GrpcProvider;
    static buildnet(): GrpcPublicProvider;
    static fromGrpcUrl(url: string, account: Account): GrpcProvider;
    static fromGrpcUrl(url: string): GrpcPublicProvider;
    /**
     * Gets the address of the associated account
     */
    get address(): string;
    /**
     * Gets the name of the associated account
     */
    get accountName(): string;
    /**
     * Gets the name of the provider
     */
    get providerName(): string;
    /**
     * Executes a read-only smart contract call
     */
    readSC(params: ReadSCParams): Promise<ReadSCData>;
    /**
     * Retrieves the balance of the associated account
     */
    balance(final?: boolean): Promise<bigint>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for signing data.
     */
    sign(): Promise<SignedData>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for buying rolls.
     */
    buyRolls(): Promise<Operation>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for selling rolls.
     */
    sellRolls(): Promise<Operation>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for transferring assets.
     */
    transfer(): Promise<Operation>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for calling smart contracts.
     */
    callSC(): Promise<Operation>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for executing smart contracts.
     */
    executeSC(): Promise<Operation>;
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for deploying smart contracts.
     */
    deploySC(): Promise<SmartContract>;
}
