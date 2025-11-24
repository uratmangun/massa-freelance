import type { MetaMaskInpageProvider } from '@metamask/providers';
/**
 * Check if a provider supports snaps by calling `wallet_getSnaps`.
 *
 * @param provider - The provider to test for snaps support
 * @returns A promise that resolves to true if snaps are supported
 */
export declare function hasSnapsSupport(provider: MetaMaskInpageProvider): Promise<boolean>;
/**
 * Get a MetaMask provider using EIP6963 specification.
 *
 * @returns Promise resolving to MetaMask provider or null if not found within timeout
 */
export declare function getMetaMaskEIP6963Provider(): Promise<MetaMaskInpageProvider | null>;
/**
 * Get a MetaMask provider that supports snaps.
 *
 * @returns Promise resolving to a compatible provider or null
 */
export declare function getMetamaskProvider(): Promise<MetaMaskInpageProvider | null>;
//# sourceMappingURL=metamask.d.ts.map