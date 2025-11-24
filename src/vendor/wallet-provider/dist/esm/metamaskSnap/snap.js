import { MASSA_SNAP_ID } from './config';
export const getInstalledSnaps = async (provider) => {
    const res = await provider.request({
        method: 'wallet_getSnaps',
    });
    if (!res) {
        throw new Error('metamask wallet_getSnaps returned empty response');
    }
    return res;
};
export const getMassaSnapInfo = async (provider, version) => {
    try {
        const snaps = await getInstalledSnaps(provider);
        return Object.values(snaps).find((snap) => snap.id === MASSA_SNAP_ID && (!version || snap.version === version));
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to get installed snap', error);
        return undefined;
    }
};
export const isConnected = async (provider) => {
    const snap = await getMassaSnapInfo(provider);
    return !!snap;
};
export const connectSnap = async (provider, params = {}) => {
    return provider.request({
        method: 'wallet_requestSnaps',
        params: {
            [MASSA_SNAP_ID]: params,
        },
    });
};
export const showPrivateKey = async (provider) => {
    return provider.request({
        method: 'wallet_invokeSnap',
        params: { snapId: MASSA_SNAP_ID, request: { method: 'showSecretKey' } },
    });
};
//# sourceMappingURL=snap.js.map