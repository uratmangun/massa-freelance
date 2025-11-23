"use client";

import { useEffect, useState } from "react";
import { useAccountStore } from "@massalabs/react-ui-kit";
import { SmartContract, Args, OperationStatus } from "@massalabs/massa-web3";
import WalletConnect from "../components/WalletConnect";

export default function DebugPage() {
  const { connectedAccount } = useAccountStore();
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(
    null
  );

  useEffect(() => {
    if (!operationId || !connectedAccount) return;

    let intervalId: NodeJS.Timeout | null = null;

    const pollStatus = async () => {
      try {
        const status = await (connectedAccount as any).getOperationStatus(
          operationId
        );
        setOperationStatus(status);

        if (
          status === OperationStatus.Success ||
          status === OperationStatus.Error
        ) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (pollError) {
        console.error("Failed to fetch operation status", pollError);
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [operationId, connectedAccount]);

  const handleDeploy = async () => {
    setError(null);
    setStatus(null);
    setContractAddress(null);
    setOperationId(null);
    setOperationStatus(null);

    if (!connectedAccount) {
      setError("Please connect your wallet first.");
      return;
    }

    setIsDeploying(true);
    try {
      setStatus("Fetching main.wasm from /main.wasm...");
      const res = await fetch("/main.wasm");
      if (!res.ok) {
        throw new Error("Failed to fetch /main.wasm");
      }

      const wasmBuffer = await res.arrayBuffer();
      const wasmBytes = new Uint8Array(wasmBuffer);

      setStatus("Deploying contract from connected wallet...");

      const args = new Args();

      const sc = await SmartContract.deploy(
        connectedAccount as any,
        wasmBytes,
        args,
        {
          fee: 10_000_000n,
          maxGas: 3_000_000_000n,
          coins: 100_000_000n,
        }
      );

      const address = (sc as any).address?.toString?.() ?? String((sc as any).address ?? "");
      const opId = (sc as any).deployOperationId ?? null;

      setStatus("Contract deployed successfully (pending confirmations).");
      if (address) {
        setContractAddress(address);
      }
      if (opId) {
        setOperationId(opId);
      }
    } catch (e: any) {
      setError(e?.message || "Unexpected error during deployment.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-green-50 dark:bg-green-950">
      <WalletConnect />

      <div className="rounded-xl border border-green-200 bg-white px-6 py-4 shadow-sm dark:border-green-800 dark:bg-green-900/50 max-w-xl w-full mx-4">
        <h1 className="mb-3 text-lg font-semibold text-green-950 dark:text-green-50">
          Debug: Deploy main.wasm
        </h1>
        <button
          onClick={handleDeploy}
          disabled={!connectedAccount || isDeploying}
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
        >
          {isDeploying ? "Deploying..." : "Deploy Contract"}
        </button>

        {status && (
          <p className="mt-3 text-sm text-green-700 dark:text-green-300">{status}</p>
        )}

        {contractAddress && (
          <p className="mt-2 text-sm text-green-900 dark:text-green-100 break-all">
            Contract address: <span className="font-mono">{contractAddress}</span>
          </p>
        )}

        {operationId && (
          <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm dark:bg-green-950/40">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Operation ID
              </p>
              <p className="break-all font-mono text-gray-600 dark:text-gray-300">
                {operationId}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-300">Status:</span>
              <span
                className={`font-semibold ${
                  operationStatus === OperationStatus.Success
                    ? "text-green-600"
                    : operationStatus === OperationStatus.Error
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {operationStatus ?? "pending..."}
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
