import { MASSA_SNAP_ID } from '../config';
export const getNetwork = async (provider) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'Provider.getNetwork',
            },
        },
    });
};
//# sourceMappingURL=getNetwork.js.map