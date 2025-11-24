"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = void 0;
const public_pb_1 = require("../../generated/grpc/public_pb");
const commons_pb_1 = require("../../generated/grpc/massa/model/v1/commons_pb");
class FilterBuilder {
    filters = [];
    addStatus(status) {
        const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
        filter.setStatus(status);
        this.filters.push(filter);
        return this;
    }
    addSlotRange(slotRange) {
        const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
        filter.setSlotRange(slotRange);
        this.filters.push(filter);
        return this;
    }
    addAsyncPoolChangesFilter(filter) {
        if (filter.empty) {
            const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
            filter.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setNone(new commons_pb_1.Empty()));
            this.filters.push(filter);
            // return if empty
            return this;
        }
        if (filter.type) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setType(filter.type));
            this.filters.push(filterOut);
        }
        if (filter.handler) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setHandler(filter.handler));
            this.filters.push(filterOut);
        }
        if (filter.destinationAddress) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setDestinationAddress(filter.destinationAddress));
            this.filters.push(filterOut);
        }
        if (filter.emitterAddress) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setEmitterAddress(filter.emitterAddress));
            this.filters.push(filterOut);
        }
        if (filter.canBeExecuted !== undefined) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setAsyncPoolChangesFilter(new public_pb_1.AsyncPoolChangesFilter().setCanBeExecuted(filter.canBeExecuted));
            this.filters.push(filterOut);
        }
        return this;
    }
    addEmptyExecutedDenounciationFilter() {
        const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
        filter.setExecutedDenounciationFilter(new public_pb_1.ExecutedDenounciationFilter().setNone(new commons_pb_1.Empty()));
        this.filters.push(filter);
        return this;
    }
    addEventFilter(filter) {
        if (filter.empty) {
            const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
            filter.setEventFilter(new public_pb_1.ExecutionEventFilter().setNone(new commons_pb_1.Empty()));
            this.filters.push(filter);
            return this;
        }
        if (filter.callerAddress) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setEventFilter(new public_pb_1.ExecutionEventFilter().setCallerAddress(filter.callerAddress));
            this.filters.push(filterOut);
        }
        if (filter.emitterAddress) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setEventFilter(new public_pb_1.ExecutionEventFilter().setEmitterAddress(filter.emitterAddress));
            this.filters.push(filterOut);
        }
        if (filter.originalOperationId) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setEventFilter(new public_pb_1.ExecutionEventFilter().setOriginalOperationId(filter.originalOperationId));
            this.filters.push(filterOut);
        }
        if (filter.isFailure !== undefined) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setEventFilter(new public_pb_1.ExecutionEventFilter().setIsFailure(filter.isFailure));
            this.filters.push(filterOut);
        }
        return this;
    }
    addExecutedOpsChangesFilter(filter) {
        if (filter.empty) {
            const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
            filter.setExecutedOpsChangesFilter(new public_pb_1.ExecutedOpsChangesFilter().setNone(new commons_pb_1.Empty()));
            this.filters.push(filter);
            return this;
        }
        if (filter.operationId) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setExecutedOpsChangesFilter(new public_pb_1.ExecutedOpsChangesFilter().setOperationId(filter.operationId));
            this.filters.push(filterOut);
        }
        return this;
    }
    addLedgerChangesFilter(filter) {
        if (filter.empty) {
            const filter = new public_pb_1.NewSlotExecutionOutputsFilter();
            filter.setLedgerChangesFilter(new public_pb_1.LedgerChangesFilter().setNone(new commons_pb_1.Empty()));
            this.filters.push(filter);
            return this;
        }
        if (filter.address) {
            const filterOut = new public_pb_1.NewSlotExecutionOutputsFilter();
            filterOut.setLedgerChangesFilter(new public_pb_1.LedgerChangesFilter().setAddress(filter.address));
            this.filters.push(filterOut);
        }
        return this;
    }
    build() {
        return this.filters;
    }
}
exports.FilterBuilder = FilterBuilder;
