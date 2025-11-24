import { MASSA_SNAP_ID } from '../config';
export const deploySC = async (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.deploySC',
                params,
            },
        },
    });
};
//# sourceMappingURL=deploySC.js.map