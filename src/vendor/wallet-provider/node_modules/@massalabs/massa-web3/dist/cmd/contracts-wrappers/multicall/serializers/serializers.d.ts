import { DeserializedResult, Serializable } from '../../../basicElements';
export declare class CallParams implements Serializable<CallParams> {
    contract: string;
    targetFunc: string;
    coins: bigint;
    params: Uint8Array;
    constructor(contract?: string, targetFunc?: string, coins?: bigint, params?: Uint8Array);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array, offset?: number): DeserializedResult<CallParams>;
}
export declare class CallResult implements Serializable<CallResult> {
    data: Uint8Array;
    constructor(data?: Uint8Array);
    serialize(): Uint8Array;
    deserialize(data: Uint8Array, offset?: number): DeserializedResult<CallResult>;
}
