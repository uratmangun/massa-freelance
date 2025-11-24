import { MASSA_SNAP_ID } from '../config';
export const executeSC = async (provider, params) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: MASSA_SNAP_ID,
            request: {
                method: 'account.executeSC',
                params,
            },
        },
    });
};
//# sourceMappingURL=executeSC.js.map