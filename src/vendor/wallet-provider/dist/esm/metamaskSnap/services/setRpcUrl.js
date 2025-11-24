import { MASSA_SNAP_ID } from '../config';
export const setRpcUrl = async (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'Provider.setNetwork',
                params,
            },
        },
    });
};
//# sourceMappingURL=setRpcUrl.js.map