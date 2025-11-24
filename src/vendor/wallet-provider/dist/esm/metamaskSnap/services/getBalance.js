import { MASSA_SNAP_ID } from '../config';
export const getBalance = (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.balance',
                params,
            },
        },
    });
};
//# sourceMappingURL=getBalance.js.map