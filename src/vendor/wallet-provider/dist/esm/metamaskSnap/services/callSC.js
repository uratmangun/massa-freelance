import { MASSA_SNAP_ID } from '../config';
export const callSC = async (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.callSC',
                params,
            },
        },
    });
};
//# sourceMappingURL=callSC.js.map