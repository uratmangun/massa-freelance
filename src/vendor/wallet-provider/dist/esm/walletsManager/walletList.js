import { BearbyWallet } from '../bearbyWallet/BearbyWallet';
import { wait } from '../utils/time';
import { MassaStationWallet } from '../massaStation/MassaStationWallet';
import { MetamaskWallet } from '../metamaskSnap/MetamaskWallet';
export const supportedWallets = [
    BearbyWallet,
    MassaStationWallet,
    MetamaskWallet,
];
export async function getWallets(delay = 200) {
    await wait(delay);
    const walletPromises = supportedWallets.map(async (WalletClass) => {
        try {
            return await WalletClass.createIfInstalled();
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error initializing wallet ${WalletClass.name}:`, error);
        }
        return null;
    });
    const resolvedWallets = await Promise.all(walletPromises);
    // remove null values: wallets that failed to initialize
    return resolvedWallets.filter((wallet) => !!wallet);
}
export async function getWallet(name, delay = 200) {
    const wallets = await getWallets(delay);
    return wallets.find((p) => p.name() === name);
}
//# sourceMappingURL=walletList.js.map