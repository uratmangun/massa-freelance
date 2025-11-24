/* eslint-disable @typescript-eslint/naming-convention */
import { Mas } from '../../basicElements';
import { Account } from '../../account';
import { GrpcPublicProvider } from './grpcPublicProvider';
import { GrpcApiUrl } from '../../utils/networks';
import { FunctionCall, ReadOnlyExecutionCall, ScExecutionEventStatus, } from '../../generated/grpc/massa/model/v1/execution_pb';
import { AddressBalanceCandidate, AddressBalanceFinal, ExecuteReadOnlyCallRequest, ExecutionQueryRequestItem, QueryStateRequest, } from '../../generated/grpc/public_pb';
import { NativeAmount } from '../../generated/grpc/massa/model/v1/amount_pb';
import { PublicServiceClient } from '../../generated/grpc/PublicServiceClientPb';
import { parseCallArgs } from '../../utils';
/**
 * GrpcProvider implements the Provider interface using gRPC for Massa blockchain interactions
 */
export class GrpcProvider extends GrpcPublicProvider {
    client;
    url;
    account;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _providerName = 'Massa GRPC provider';
    /**
     * Creates a new GrpcProvider instance
     * @param url - The gRPC endpoint URL
     * @param account - The account associated with this provider
     */
    constructor(client, url, account) {
        super(client, url);
        this.client = client;
        this.url = url;
        this.account = account;
    }
    static mainnet(account) {
        return account
            ? GrpcProvider.fromGrpcUrl(GrpcApiUrl.Mainnet, account)
            : GrpcProvider.fromGrpcUrl(GrpcApiUrl.Mainnet);
    }
    static buildnet(account) {
        return account
            ? GrpcProvider.fromGrpcUrl(GrpcApiUrl.Buildnet, account)
            : GrpcProvider.fromGrpcUrl(GrpcApiUrl.Buildnet);
    }
    static fromGrpcUrl(url, account) {
        if (account) {
            return new GrpcProvider(new PublicServiceClient(url), url, account);
        }
        return new GrpcPublicProvider(new PublicServiceClient(url), url);
    }
    /**
     * Gets the address of the associated account
     */
    get address() {
        return this.account.address.toString();
    }
    /**
     * Gets the name of the associated account
     */
    get accountName() {
        return this.account.address.toString();
    }
    /**
     * Gets the name of the provider
     */
    get providerName() {
        return this._providerName;
    }
    /**
     * Executes a read-only smart contract call
     */
    async readSC(params) {
        const parameter = parseCallArgs(params.parameter);
        const account = await Account.generate();
        const caller = account.address.toString();
        const maxGas = params.maxGas ?? 0n;
        const request = new ExecuteReadOnlyCallRequest();
        const call = new ReadOnlyExecutionCall();
        call.setMaxGas(Number(maxGas));
        call.setCallerAddress(caller);
        call.setCallStackList([]);
        call.setFunctionCall(new FunctionCall()
            .setTargetAddress(params.target)
            .setTargetFunction(params.func)
            .setParameter(parameter));
        // fee
        if (params.fee) {
            call.setFee(new NativeAmount()
                .setMantissa(Number(params.fee))
                .setScale(Mas.NB_DECIMALS));
        }
        request.setCall(call);
        const response = await this.client.executeReadOnlyCall(request);
        const output = response.getOutput();
        if (!output) {
            throw new Error('No output received');
        }
        const result = {
            value: output.getCallResult_asU8(),
            info: {
                gasCost: output.getUsedGas(),
                events: output
                    .getOut()
                    ?.getEventsList()
                    .map((ev) => {
                    const event = {
                        data: ev.getData_asB64(),
                        context: {
                            slot: {
                                period: Number(ev.getContext()?.getOriginSlot()?.getPeriod() ?? 0),
                                thread: Number(ev.getContext()?.getOriginSlot()?.getThread() ?? 0),
                            },
                            read_only: ev.getContext()?.getStatus() ===
                                ScExecutionEventStatus.SC_EXECUTION_EVENT_STATUS_READ_ONLY,
                            call_stack: ev.getContext()?.getCallStackList() ?? [],
                            index_in_slot: Number(ev.getContext()?.getIndexInSlot() ?? 0),
                            is_final: ev.getContext()?.getStatus() ===
                                ScExecutionEventStatus.SC_EXECUTION_EVENT_STATUS_FINAL,
                        },
                    };
                    return event;
                }) ?? [],
            },
        };
        return result;
    }
    /**
     * Retrieves the balance of the associated account
     */
    async balance(final = true) {
        try {
            const queries = new ExecutionQueryRequestItem();
            if (final) {
                queries.setAddressBalanceFinal(new AddressBalanceFinal().setAddress(this.account.address.toString()));
            }
            else {
                queries.setAddressBalanceCandidate(new AddressBalanceCandidate().setAddress(this.account.address.toString()));
            }
            const response = await this.client.queryState(new QueryStateRequest().setQueriesList([queries]));
            const list = response.getResponsesList();
            const result = list[0];
            if (!result) {
                throw new Error('No response received for balance query');
            }
            if (result.hasError()) {
                throw new Error(`Query state error: ${result.getError()?.getMessage() || 'Unknown error'}`);
            }
            if (!result.hasResult()) {
                throw new Error('No response item received for balance query');
            }
            const responseItem = result.getResult();
            if (!responseItem?.hasAmount()) {
                throw new Error('No response item received for balance query');
            }
            const amount = responseItem.getAmount();
            if (!amount) {
                throw new Error('No amount received for balance query');
            }
            return BigInt(amount.getMantissa());
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get balance: ${error.message}`);
            }
            throw new Error('Failed to get balance: Unknown error');
        }
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for signing data.
     */
    /* eslint-disable-next-line class-methods-use-this */
    sign() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for buying rolls.
     */
    /* eslint-disable-next-line class-methods-use-this */
    buyRolls() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for selling rolls.
     */
    /* eslint-disable-next-line class-methods-use-this */
    sellRolls() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for transferring assets.
     */
    /* eslint-disable-next-line class-methods-use-this */
    transfer() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for calling smart contracts.
     */
    /* eslint-disable-next-line class-methods-use-this */
    callSC() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for executing smart contracts.
     */
    /* eslint-disable-next-line class-methods-use-this */
    executeSC() {
        throw new Error('Method not implemented.');
    }
    /**
     * @deprecated This method cannot be implemented in the GRPC provider.
     * Use another provider or alternative method for deploying smart contracts.
     */
    /* eslint-disable-next-line class-methods-use-this */
    deploySC() {
        throw new Error('Method not implemented.');
    }
}
