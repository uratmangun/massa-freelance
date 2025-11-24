import { ErrorCodes } from './utils/codes';
export type BaseErrorParameters = {
    code?: ErrorCodes;
    docsPath?: string;
    metaMessages?: string[];
} & ({
    cause?: never;
    details?: string;
} | {
    cause: BaseError | Error;
    details?: never;
});
export type BaseErrorType = BaseError & {
    name: 'WalletProviderError';
};
export declare class BaseError extends Error {
    metaMessages: string[];
    docsPath?: string;
    code: ErrorCodes;
    name: string;
    constructor(shortMessage: string, args?: BaseErrorParameters);
}
//# sourceMappingURL=base.d.ts.map