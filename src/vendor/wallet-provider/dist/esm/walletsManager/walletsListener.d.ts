import { Wallet } from '../wallet/interface';
export declare class WalletsListener {
    intervalDelay: number;
    private intervalId;
    private currentWallets;
    constructor(intervalDelay?: number);
    private checkForChanges;
    private hasWalletsChanged;
    subscribe(callback: (wallets: Wallet[]) => void): Promise<{
        unsubscribe: () => void;
    }>;
}
//# sourceMappingURL=walletsListener.d.ts.map