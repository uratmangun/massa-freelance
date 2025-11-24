import { MASSA_SNAP_ID } from '../config';
export const transfer = async (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.sendTransaction',
                params,
            },
        },
    });
};
//# sourceMappingURL=transfer.js.map