/**
 * @fileoverview gRPC-Web generated client stub for massa.api.v1
 * @enhanceable
 * @public
 */
import * as grpcWeb from 'grpc-web';
import * as public_pb from './public_pb';
export declare class PublicServiceClient {
    client_: grpcWeb.AbstractClientBase;
    hostname_: string;
    credentials_: null | {
        [index: string]: string;
    };
    options_: null | {
        [index: string]: any;
    };
    constructor(hostname: string, credentials?: null | {
        [index: string]: string;
    }, options?: null | {
        [index: string]: any;
    });
    methodDescriptorExecuteReadOnlyCall: grpcWeb.MethodDescriptor<public_pb.ExecuteReadOnlyCallRequest, public_pb.ExecuteReadOnlyCallResponse>;
    executeReadOnlyCall(request: public_pb.ExecuteReadOnlyCallRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.ExecuteReadOnlyCallResponse>;
    executeReadOnlyCall(request: public_pb.ExecuteReadOnlyCallRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.ExecuteReadOnlyCallResponse) => void): grpcWeb.ClientReadableStream<public_pb.ExecuteReadOnlyCallResponse>;
    methodDescriptorGetBlocks: grpcWeb.MethodDescriptor<public_pb.GetBlocksRequest, public_pb.GetBlocksResponse>;
    getBlocks(request: public_pb.GetBlocksRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetBlocksResponse>;
    getBlocks(request: public_pb.GetBlocksRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetBlocksResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetBlocksResponse>;
    methodDescriptorGetDatastoreEntries: grpcWeb.MethodDescriptor<public_pb.GetDatastoreEntriesRequest, public_pb.GetDatastoreEntriesResponse>;
    getDatastoreEntries(request: public_pb.GetDatastoreEntriesRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetDatastoreEntriesResponse>;
    getDatastoreEntries(request: public_pb.GetDatastoreEntriesRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetDatastoreEntriesResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetDatastoreEntriesResponse>;
    methodDescriptorGetEndorsements: grpcWeb.MethodDescriptor<public_pb.GetEndorsementsRequest, public_pb.GetEndorsementsResponse>;
    getEndorsements(request: public_pb.GetEndorsementsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetEndorsementsResponse>;
    getEndorsements(request: public_pb.GetEndorsementsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetEndorsementsResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetEndorsementsResponse>;
    methodDescriptorGetNextBlockBestParents: grpcWeb.MethodDescriptor<public_pb.GetNextBlockBestParentsRequest, public_pb.GetNextBlockBestParentsResponse>;
    getNextBlockBestParents(request: public_pb.GetNextBlockBestParentsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetNextBlockBestParentsResponse>;
    getNextBlockBestParents(request: public_pb.GetNextBlockBestParentsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetNextBlockBestParentsResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetNextBlockBestParentsResponse>;
    methodDescriptorGetOperations: grpcWeb.MethodDescriptor<public_pb.GetOperationsRequest, public_pb.GetOperationsResponse>;
    getOperations(request: public_pb.GetOperationsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetOperationsResponse>;
    getOperations(request: public_pb.GetOperationsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetOperationsResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetOperationsResponse>;
    methodDescriptorGetScExecutionEvents: grpcWeb.MethodDescriptor<public_pb.GetScExecutionEventsRequest, public_pb.GetScExecutionEventsResponse>;
    getScExecutionEvents(request: public_pb.GetScExecutionEventsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetScExecutionEventsResponse>;
    getScExecutionEvents(request: public_pb.GetScExecutionEventsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetScExecutionEventsResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetScExecutionEventsResponse>;
    methodDescriptorGetSelectorDraws: grpcWeb.MethodDescriptor<public_pb.GetSelectorDrawsRequest, public_pb.GetSelectorDrawsResponse>;
    getSelectorDraws(request: public_pb.GetSelectorDrawsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetSelectorDrawsResponse>;
    getSelectorDraws(request: public_pb.GetSelectorDrawsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetSelectorDrawsResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetSelectorDrawsResponse>;
    methodDescriptorGetStakers: grpcWeb.MethodDescriptor<public_pb.GetStakersRequest, public_pb.GetStakersResponse>;
    getStakers(request: public_pb.GetStakersRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetStakersResponse>;
    getStakers(request: public_pb.GetStakersRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetStakersResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetStakersResponse>;
    methodDescriptorGetStatus: grpcWeb.MethodDescriptor<public_pb.GetStatusRequest, public_pb.GetStatusResponse>;
    getStatus(request: public_pb.GetStatusRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetStatusResponse>;
    getStatus(request: public_pb.GetStatusRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetStatusResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetStatusResponse>;
    methodDescriptorGetTransactionsThroughput: grpcWeb.MethodDescriptor<public_pb.GetTransactionsThroughputRequest, public_pb.GetTransactionsThroughputResponse>;
    getTransactionsThroughput(request: public_pb.GetTransactionsThroughputRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetTransactionsThroughputResponse>;
    getTransactionsThroughput(request: public_pb.GetTransactionsThroughputRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetTransactionsThroughputResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetTransactionsThroughputResponse>;
    methodDescriptorQueryState: grpcWeb.MethodDescriptor<public_pb.QueryStateRequest, public_pb.QueryStateResponse>;
    queryState(request: public_pb.QueryStateRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.QueryStateResponse>;
    queryState(request: public_pb.QueryStateRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.QueryStateResponse) => void): grpcWeb.ClientReadableStream<public_pb.QueryStateResponse>;
    methodDescriptorSearchBlocks: grpcWeb.MethodDescriptor<public_pb.SearchBlocksRequest, public_pb.SearchBlocksResponse>;
    searchBlocks(request: public_pb.SearchBlocksRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.SearchBlocksResponse>;
    searchBlocks(request: public_pb.SearchBlocksRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.SearchBlocksResponse) => void): grpcWeb.ClientReadableStream<public_pb.SearchBlocksResponse>;
    methodDescriptorSearchEndorsements: grpcWeb.MethodDescriptor<public_pb.SearchEndorsementsRequest, public_pb.SearchEndorsementsResponse>;
    searchEndorsements(request: public_pb.SearchEndorsementsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.SearchEndorsementsResponse>;
    searchEndorsements(request: public_pb.SearchEndorsementsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.SearchEndorsementsResponse) => void): grpcWeb.ClientReadableStream<public_pb.SearchEndorsementsResponse>;
    methodDescriptorSearchOperations: grpcWeb.MethodDescriptor<public_pb.SearchOperationsRequest, public_pb.SearchOperationsResponse>;
    searchOperations(request: public_pb.SearchOperationsRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.SearchOperationsResponse>;
    searchOperations(request: public_pb.SearchOperationsRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.SearchOperationsResponse) => void): grpcWeb.ClientReadableStream<public_pb.SearchOperationsResponse>;
    methodDescriptorGetOperationABICallStacks: grpcWeb.MethodDescriptor<public_pb.GetOperationABICallStacksRequest, public_pb.GetOperationABICallStacksResponse>;
    getOperationABICallStacks(request: public_pb.GetOperationABICallStacksRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetOperationABICallStacksResponse>;
    getOperationABICallStacks(request: public_pb.GetOperationABICallStacksRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetOperationABICallStacksResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetOperationABICallStacksResponse>;
    methodDescriptorGetSlotABICallStacks: grpcWeb.MethodDescriptor<public_pb.GetSlotABICallStacksRequest, public_pb.GetSlotABICallStacksResponse>;
    getSlotABICallStacks(request: public_pb.GetSlotABICallStacksRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetSlotABICallStacksResponse>;
    getSlotABICallStacks(request: public_pb.GetSlotABICallStacksRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetSlotABICallStacksResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetSlotABICallStacksResponse>;
    methodDescriptorGetSlotTransfers: grpcWeb.MethodDescriptor<public_pb.GetSlotTransfersRequest, public_pb.GetSlotTransfersResponse>;
    getSlotTransfers(request: public_pb.GetSlotTransfersRequest, metadata?: grpcWeb.Metadata | null): Promise<public_pb.GetSlotTransfersResponse>;
    getSlotTransfers(request: public_pb.GetSlotTransfersRequest, metadata: grpcWeb.Metadata | null, callback: (err: grpcWeb.RpcError, response: public_pb.GetSlotTransfersResponse) => void): grpcWeb.ClientReadableStream<public_pb.GetSlotTransfersResponse>;
    methodDescriptorNewBlocksServer: grpcWeb.MethodDescriptor<public_pb.NewBlocksServerRequest, public_pb.NewBlocksServerResponse>;
    newBlocksServer(request: public_pb.NewBlocksServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewBlocksServerResponse>;
    methodDescriptorNewEndorsementsServer: grpcWeb.MethodDescriptor<public_pb.NewEndorsementsServerRequest, public_pb.NewEndorsementsServerResponse>;
    newEndorsementsServer(request: public_pb.NewEndorsementsServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewEndorsementsServerResponse>;
    methodDescriptorNewFilledBlocksServer: grpcWeb.MethodDescriptor<public_pb.NewFilledBlocksServerRequest, public_pb.NewFilledBlocksServerResponse>;
    newFilledBlocksServer(request: public_pb.NewFilledBlocksServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewFilledBlocksServerResponse>;
    methodDescriptorNewOperationsServer: grpcWeb.MethodDescriptor<public_pb.NewOperationsServerRequest, public_pb.NewOperationsServerResponse>;
    newOperationsServer(request: public_pb.NewOperationsServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewOperationsServerResponse>;
    methodDescriptorNewSlotExecutionOutputsServer: grpcWeb.MethodDescriptor<public_pb.NewSlotExecutionOutputsServerRequest, public_pb.NewSlotExecutionOutputsServerResponse>;
    newSlotExecutionOutputsServer(request: public_pb.NewSlotExecutionOutputsServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewSlotExecutionOutputsServerResponse>;
    methodDescriptorTransactionsThroughputServer: grpcWeb.MethodDescriptor<public_pb.TransactionsThroughputServerRequest, public_pb.TransactionsThroughputServerResponse>;
    transactionsThroughputServer(request: public_pb.TransactionsThroughputServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.TransactionsThroughputServerResponse>;
    methodDescriptorNewTransfersInfoServer: grpcWeb.MethodDescriptor<public_pb.NewTransfersInfoServerRequest, public_pb.NewTransfersInfoServerResponse>;
    newTransfersInfoServer(request: public_pb.NewTransfersInfoServerRequest, metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<public_pb.NewTransfersInfoServerResponse>;
}
