import { BaseError } from './base';
import { ErrorCodes } from './utils/codes';
export class UserRejectionError extends BaseError {
    name = 'UserRejectionError';
    constructor({ operationName, cause, }) {
        super(`The operation ${operationName} was rejected by the user.`, {
            code: ErrorCodes.UserRejection,
            cause,
        });
    }
}
//# sourceMappingURL=userRejection.js.map