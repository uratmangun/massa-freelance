import { NewSlotExecutionOutputsFilter } from '../../generated/grpc/public_pb';
import { AsyncPoolChangeType, ExecutionOutputStatus } from '../../generated/grpc/massa/model/v1/execution_pb';
import { SlotRange } from '../../generated/grpc/massa/model/v1/slot_pb';
export declare class FilterBuilder {
    private filters;
    addStatus(status: ExecutionOutputStatus): FilterBuilder;
    addSlotRange(slotRange: SlotRange): FilterBuilder;
    addAsyncPoolChangesFilter(filter: {
        empty?: boolean;
        type?: AsyncPoolChangeType;
        handler?: string;
        destinationAddress?: string;
        emitterAddress?: string;
        canBeExecuted?: boolean;
    }): FilterBuilder;
    addEmptyExecutedDenounciationFilter(): FilterBuilder;
    addEventFilter(filter: {
        empty?: boolean;
        callerAddress?: string;
        emitterAddress?: string;
        originalOperationId?: string;
        isFailure?: boolean;
    }): FilterBuilder;
    addExecutedOpsChangesFilter(filter: {
        empty?: boolean;
        operationId?: string;
    }): FilterBuilder;
    addLedgerChangesFilter(filter: {
        empty?: boolean;
        address?: string;
    }): FilterBuilder;
    build(): NewSlotExecutionOutputsFilter[];
}
