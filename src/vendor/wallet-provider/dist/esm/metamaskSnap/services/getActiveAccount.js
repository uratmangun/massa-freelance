import { MASSA_SNAP_ID } from '../config';
export const getActiveAccount = async (provider) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.getActive',
            },
        },
    });
};
//# sourceMappingURL=getActiveAccount.js.map