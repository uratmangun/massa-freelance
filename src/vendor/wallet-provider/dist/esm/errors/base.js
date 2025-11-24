import { ErrorCodes } from './utils/codes';
export class BaseError extends Error {
    metaMessages;
    docsPath;
    code;
    name = 'WalletProviderError';
    constructor(shortMessage, args = { code: ErrorCodes.UnknownError }) {
        super();
        const metaMessageStr = args.metaMessages?.map((msg) => `Meta: ${msg}`).join('\n') || '';
        const docsMessageStr = args.docsPath
            ? `Docs: ${args.docsPath} for more information.`
            : '';
        const detailsMessage = args.details ? `Details: ${args.details}` : '';
        this.message = [
            shortMessage,
            metaMessageStr,
            docsMessageStr,
            detailsMessage,
        ]
            .filter(Boolean)
            .join('\n\n');
        this.metaMessages = args.metaMessages || [];
        this.docsPath = args.docsPath;
        this.code = args.code ?? ErrorCodes.UnknownError;
        this.cause = args.cause;
    }
}
//# sourceMappingURL=base.js.map