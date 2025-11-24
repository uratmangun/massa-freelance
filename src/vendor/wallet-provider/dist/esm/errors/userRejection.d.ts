import { BaseError } from './base';
export type UserRejectionErrorType = UserRejectionError & {
    name: 'UserRejectionError';
};
export declare class UserRejectionError extends BaseError {
    name: string;
    constructor({ operationName, cause, }: {
        operationName: string;
        cause?: Error;
    });
}
//# sourceMappingURL=userRejection.d.ts.map