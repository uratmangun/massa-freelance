import { NodeStatus } from '../generated/client-types';
import { NodeStatusInfo } from '../provider';
import { rpcTypes as t } from '../generated';
import { ExecuteSCReadOnlyParams, ExecuteSCReadOnlyResult, ReadOnlyCallResult } from './types';
export declare function formatNodeStatusObject(status: NodeStatus): NodeStatusInfo;
export declare function formatReadOnlyCallResponse(res: t.ExecuteReadOnlyResponse): ReadOnlyCallResult;
export declare function formatReadOnlyExecuteSCParams(params: ExecuteSCReadOnlyParams): t.ReadOnlyBytecodeExecution;
export declare function formatReadOnlyExecuteSCResponse(res: t.ExecuteReadOnlyResponse): ExecuteSCReadOnlyResult;
export declare function serializeDatastore(data: Map<Uint8Array, Uint8Array>): number[];
