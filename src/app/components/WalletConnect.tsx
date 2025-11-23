'use client';

import { useEffect, useState } from "react";
import { useAccountStore } from "@massalabs/react-ui-kit";
import { shortenAddress } from "../lib/utils";
import ConnectWalletModal from "./ConnectWalletModal";

export default function WalletConnect() {
  const [toggleConnectWalletModal, setToggleConnectWalletModal] =
    useState(false);
  const { connectedAccount } = useAccountStore();
  const [selectedAccount, setSelectedAccount] = useState(
    connectedAccount?.address || ""
  );

  useEffect(() => {
    setSelectedAccount(connectedAccount?.address || "");
  }, [connectedAccount, connectedAccount?.address]);

  const handleConnectClick = () => {
    setToggleConnectWalletModal(true);
  };

  return (
    <>
      {connectedAccount ? (
        <button 
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-400" 
          onClick={handleConnectClick}
        >
          Connected: {shortenAddress(selectedAccount, 3)}
        </button>
      ) : (
        <button 
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-400" 
          onClick={handleConnectClick}
        >
          Connect Wallet
        </button>
      )}

      <ConnectWalletModal
        toggleConnectWalletModal={toggleConnectWalletModal}
        setToggleConnectWalletModal={setToggleConnectWalletModal}
      />
    </>
  );
}
