import { getWallets } from './walletList';
export class WalletsListener {
    intervalDelay;
    intervalId;
    currentWallets = [];
    constructor(intervalDelay = 1000) {
        this.intervalDelay = intervalDelay;
    }
    async checkForChanges(callback) {
        try {
            const newWallets = await getWallets(0);
            if (this.hasWalletsChanged(newWallets)) {
                this.currentWallets = newWallets;
                callback(newWallets);
            }
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error checking wallet list changes:', error);
        }
    }
    hasWalletsChanged(newWallets) {
        const newList = new Set(newWallets.map((p) => p.name));
        const currentList = new Set(this.currentWallets.map((p) => p.name));
        if (newList.size !== currentList.size ||
            [...newList].some((name) => !currentList.has(name))) {
            return true;
        }
        return false;
    }
    async subscribe(callback) {
        this.currentWallets = await getWallets();
        callback(this.currentWallets);
        this.intervalId = setInterval(() => this.checkForChanges(callback), this.intervalDelay);
        return {
            unsubscribe: () => {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                }
            },
        };
    }
}
//# sourceMappingURL=walletsListener.js.map