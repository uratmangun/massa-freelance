import { useCallback, useEffect, useRef, useState } from "react";
import { useAccountStore } from "@massalabs/react-ui-kit";
import { getWallets } from "@massalabs/wallet-provider";

type SavedAccount = {
  address: string;
  providerName: string;
};

const EMPTY_ACCOUNT: SavedAccount = {
  address: "",
  providerName: "",
};

const useAccountSync = () => {
  const { connectedAccount, setCurrentWallet } = useAccountStore();

  const [savedAccount, setSavedAccountState] = useState<SavedAccount>(
    EMPTY_ACCOUNT
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("saved-account");
      if (saved) {
        try {
          setSavedAccountState(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing saved account:", error);
        }
      }
    }
  }, []);

  const setSavedAccount = useCallback((account: SavedAccount) => {
    setSavedAccountState(account);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("saved-account", JSON.stringify(account));
    }
  }, []);

  const getStoredAccount = useCallback(async (address: string) => {
    const wallets = await getWallets();
    for (const wallet of wallets) {
      const accounts = await wallet.accounts();
      const matchingAccount = accounts.find((a) => a.address === address);
      if (matchingAccount) {
        return { account: matchingAccount, wallet, wallets };
      }
    }
  }, []);

  const setAccountFromSaved = useCallback(async () => {
    if (!savedAccount.address) return;

    const stored = await getStoredAccount(savedAccount.address);
    if (stored) {
      setCurrentWallet(stored.wallet, stored.account);
    }
  }, [savedAccount.address, getStoredAccount, setCurrentWallet]);

  useEffect(() => {
    const shouldUpdateSavedAccount =
      connectedAccount && connectedAccount.address !== savedAccount.address;

    if (shouldUpdateSavedAccount) {
      const { address, providerName } = connectedAccount;
      setSavedAccount({ address, providerName });
    }
  }, [connectedAccount, setSavedAccount, savedAccount.address]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      setAccountFromSaved();
    }
  }, [setAccountFromSaved]);

  return { setSavedAccount };
};

export default useAccountSync;
