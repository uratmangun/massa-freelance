import type { Metadata } from "next";
import DebugClient from "./DebugClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Massa freelance – Debug",
};

export default function DebugPage() {
  return <DebugClient />;
}

/*

  const [readConfigResult, setReadConfigResult] = useState<
    | { recipient: string; amount: string; interval: string }
    | null
  >(null);
  const [isCalling, setIsCalling] = useState(false);
  const [autonomousBalance, setAutonomousBalance] = useState<
    { final: string; candidate: string } | null
  >(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferOperationId, setTransferOperationId] = useState<string | null>(
    null
  );
  const [isTransferring, setIsTransferring] = useState(false);
  const [simBalanceMas, setSimBalanceMas] = useState<string>("");
  const [simPayoutPerIntervalMas, setSimPayoutPerIntervalMas] =
    useState<string>("");
  const [eventLogs, setEventLogs] = useState<
    { data: string; slot: string; isFinal: boolean; isError: boolean }[]
  >([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const nanoAmountDisplay =
    amount.trim().length === 0 || Number.isNaN(Number(amount))
      ? ""
      : Math.round(Number(amount) * 1_000_000_000).toString();

  const intervalSlotsDisplay = (() => {
    const trimmed = interval.trim();
    if (trimmed.length === 0) return "";

    const value = Number(trimmed);
    if (!Number.isFinite(value) || Number.isNaN(value) || value <= 0) return "";

    let slotsPerUnit: number;
    switch (intervalUnit) {
      case "minute":
        slotsPerUnit = 4; // approx: 1 slot ~ 15s
        break;
      case "hour":
        slotsPerUnit = 4 * 60;
        break;
      case "day":
        slotsPerUnit = 4 * 60 * 24;
        break;
      case "month":
        slotsPerUnit = 4 * 60 * 24 * 30;
        break;
      default:
        slotsPerUnit = 1;
    }

    const slots = Math.round(value * slotsPerUnit);
    return slots.toString();
  })();

  const simResult = (() => {
    const balanceTrimmed = simBalanceMas.trim();
    const payoutTrimmed = simPayoutPerIntervalMas.trim();
    if (!balanceTrimmed || !payoutTrimmed) return null;

    const balanceBeforeStart = Number(balanceTrimmed);
    const payoutPer = Number(payoutTrimmed);
    const feePer = 0.1075; // MAS per interval
    const startCost = 0.1441; // MAS, one-time cost to call `start`

    if (
      !Number.isFinite(balanceBeforeStart) ||
      !Number.isFinite(payoutPer) ||
      balanceBeforeStart <= 0 ||
      payoutPer <= 0
    ) {
      return null;
    }

    const per = payoutPer + feePer; // total cost per interval (payout + fixed fee)

    const effectiveBalance = balanceBeforeStart - startCost;
    if (effectiveBalance <= 0) {
      // Not enough to even pay the start cost
      return {
        intervals: 0,
        costPer: per.toFixed(6),
        totalSent: "0.000000",
        remaining: effectiveBalance.toFixed(6),
        totalPayout: "0.000000",
        fees: "0.000000",
        payoutPer: payoutPer.toFixed(6),
        startCost: startCost.toFixed(6),
        balanceAfterStart: effectiveBalance.toFixed(6),
      };
    }

    const intervals = Math.floor(effectiveBalance / per);

    const totalSentIntervals = intervals * per;
    const remainingAfterIntervals = effectiveBalance - totalSentIntervals + 0.0366;
    const totalPayout = intervals * payoutPer;
    const fees = totalSentIntervals - totalPayout;

    return {
      intervals,
      costPer: per.toFixed(6),
      totalSent: totalSentIntervals.toFixed(6),
      remaining: remainingAfterIntervals.toFixed(6),
      totalPayout: totalPayout.toFixed(6),
      fees: fees.toFixed(6),
      payoutPer: payoutPer.toFixed(6),
      startCost: startCost.toFixed(6),
      balanceAfterStart: effectiveBalance.toFixed(6),
    };
  })();

  const nanoToMas = (nanoStr: string): string => {
    const n = Number(nanoStr);
    if (!Number.isFinite(n) || Number.isNaN(n)) return "";
    const mas = n / 1_000_000_000;
    return mas.toString();
  };

  const slotsToHuman = (slotsStr: string): string => {
    const slots = Number(slotsStr);
    if (!Number.isFinite(slots) || slots <= 0) return "";

    // 1 slot ~ 15s
    const seconds = slots * 15;
    const minutes = seconds / 60;

    if (minutes < 1) {
      return `${seconds.toFixed(0)} seconds`;
    }
    if (minutes < 60) {
      return `${minutes.toFixed(1)} minutes`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
      return `${hours.toFixed(2)} hours`;
    }

    const days = hours / 24;
    if (days < 30) {
      return `${days.toFixed(2)} days`;
    }

    const months = days / 30;
    return `${months.toFixed(2)} months`;
  };

  useEffect(() => {
    const address = connectedAccount?.address;
    if (!address) {
      lastFinalBalanceRef.current = null;
      return;
    }

    let cancelled = false;

    const pollBalance = async () => {
      try {
        const response = await fetch(BUILDNET_RPC_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "get_addresses",
            params: [[address]],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();

        if (!data.error && Array.isArray(data.result) && data.result.length > 0) {
          const info = data.result[0] as any;
          const finalBalanceStr = String(info.final_balance ?? "0");
          const finalBalance = Number(finalBalanceStr);

          if (!Number.isFinite(finalBalance)) {
            return;
          }

          if (lastFinalBalanceRef.current === null) {
            lastFinalBalanceRef.current = finalBalance;
          } else if (finalBalance > lastFinalBalanceRef.current) {
            const delta = finalBalance - lastFinalBalanceRef.current;
            lastFinalBalanceRef.current = finalBalance;

            const deltaMas = delta.toFixed(6);
            const newBalanceMas = finalBalance.toFixed(6);

            toast.success(`Received ${deltaMas} MAS`, {
              description: `New balance: ${newBalanceMas} MAS`,
            });
          } else {
            lastFinalBalanceRef.current = finalBalance;
          }
        }
      } catch (e) {
        console.error("Error polling wallet balance", e);
      }

      if (!cancelled) {
        setTimeout(pollBalance, 10000);
      }
    };

    pollBalance();

    return () => {
      cancelled = true;
    };
  }, [connectedAccount?.address]);

  useEffect(() => {
    if (!mainOperationId || !connectedAccount) return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const status = await (connectedAccount as any).getOperationStatus(
          mainOperationId
        );
        setMainOperationStatus(status);

        if (
          status === OperationStatus.Success ||
          status === OperationStatus.Error
        ) {
          return;
        }
      } catch (pollError) {
        console.error("Failed to fetch main operation status", pollError);
      }

      if (!cancelled) {
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [mainOperationId, connectedAccount]);

  useEffect(() => {
    if (!autonomousOperationId || !connectedAccount) return;

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const status = await (connectedAccount as any).getOperationStatus(
          autonomousOperationId
        );
        setAutonomousOperationStatus(status);

        if (
          status === OperationStatus.Success ||
          status === OperationStatus.Error
        ) {
          return;
        }
      } catch (pollError) {
        console.error(
          "Failed to fetch autonomous operation status",
          pollError
        );
      }

      if (!cancelled) {
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [autonomousOperationId, connectedAccount]);

  const handleFetchEvents = async () => {
    if (!connectedAccount) {
      setEventsError("Please connect your wallet first.");
      return;
    }
    if (!autonomousAddress) {
      setEventsError("Please set the autonomous contract address first.");
      return;
    }

    setIsFetchingEvents(true);
    setEventsError(null);
    try {
      const events = await (connectedAccount as any).getEvents({
        emitter_address: autonomousAddress,
        is_final: true,
      });

      const mapped = (Array.isArray(events) ? events : []).map((ev: any) => {
        const slot = ev.context?.slot;
        const slotStr =
          slot && typeof slot.period === "number" && typeof slot.thread === "number"
            ? `${slot.period}:${slot.thread}`
            : "?";
        const isFinal = Boolean(ev.context?.is_final);
        const isError = Boolean(ev.context?.is_error);

        return {
          data: String(ev.data ?? ""),
          slot: slotStr,
          isFinal,
          isError,
        };
      });

      setEventLogs(mapped.reverse());
    } catch (e: any) {
      setEventsError(e?.message || "Failed to fetch events.");
    } finally {
      setIsFetchingEvents(false);
    }
  };

  const handleDeployMain = async () => {
    setMainError(null);
    setMainStatus(null);
    setContractAddress(null);
    setMainOperationId(null);
    setMainOperationStatus(null);

    if (!connectedAccount) {
      setMainError("Please connect your wallet first.");
      return;
    }

    setIsDeployingMain(true);
    try {
      setMainStatus("Fetching main.wasm from /main.wasm...");
      const res = await fetch("/main.wasm");
      if (!res.ok) {
        throw new Error("Failed to fetch /main.wasm");
      }

      const wasmBuffer = await res.arrayBuffer();
      const wasmBytes = new Uint8Array(wasmBuffer);

      setMainStatus("Deploying contract from connected wallet...");

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

      const address =
        (sc as any).address?.toString?.() ?? String((sc as any).address ?? "");
      const opId = (sc as any).deployOperationId ?? null;

      setMainStatus("Contract deployed successfully (pending confirmations).");
      if (address) {
        setContractAddress(address);
      }
      if (opId) {
        setMainOperationId(opId);
      }
    } catch (e: any) {
      setMainError(e?.message || "Unexpected error during deployment.");
    } finally {
      setIsDeployingMain(false);
    }
  };

  const handleDeployAutonomous = async () => {
    setAutonomousError(null);
    setAutonomousStatus(null);
    setAutonomousOperationId(null);
    setAutonomousOperationStatus(null);

    if (!connectedAccount) {
      setAutonomousError("Please connect your wallet first.");
      return;
    }

    setIsDeployingAutonomous(true);
    try {
      setAutonomousStatus("Fetching autonomous.wasm from /autonomous.wasm...");
      const res = await fetch("/autonomous.wasm");
      if (!res.ok) {
        throw new Error("Failed to fetch /autonomous.wasm");
      }

      const wasmBuffer = await res.arrayBuffer();
      const wasmBytes = new Uint8Array(wasmBuffer);

      setAutonomousStatus("Deploying autonomous contract from connected wallet...");

      const trimmedAmount = amount.trim();
      if (trimmedAmount.length === 0) {
        setAutonomousError("Please enter an amount in MAS.");
        return;
      }
      const masAmount = Number(trimmedAmount);
      if (!Number.isFinite(masAmount) || Number.isNaN(masAmount) || masAmount < 0) {
        setAutonomousError("Invalid MAS amount.");
        return;
      }
      const nanoAmount = BigInt(Math.round(masAmount * 1_000_000_000));

      if (!intervalSlotsDisplay) {
        setAutonomousError("Please enter a valid interval.");
        return;
      }
      const intervalSlots = BigInt(intervalSlotsDisplay);

      const args = new Args();
      // Example constructor args (you can adjust in the UI inputs below):
      // 1) recipient address (string)
      // 2) amount per transfer (u64 nanoMAS)
      // 3) interval in slots (u64)
      args.addString(recipient);
      args.addU64(nanoAmount);
      args.addU64(intervalSlots);

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

      const address =
        (sc as any).address?.toString?.() ?? String((sc as any).address ?? "");
      const opId = (sc as any).deployOperationId ?? null;

      setAutonomousStatus(
        "Autonomous contract deployed successfully (pending confirmations)."
      );
      if (address) {
        setAutonomousAddress(address);
      }
      if (opId) {
        setAutonomousOperationId(opId);
      }
    } catch (e: any) {
      setAutonomousError(
        e?.message || "Unexpected error during autonomous deployment."
      );
    } finally {
      setIsDeployingAutonomous(false);
    }
  };

  const handleReadConfig = async () => {
    if (!connectedAccount) {
      setAutonomousError("Please connect your wallet first.");
      return;
    }
    if (!autonomousAddress) {
      setAutonomousError("Please set the autonomous contract address first.");
      return;
    }

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const result = await (connectedAccount as any).readSC({
        target: autonomousAddress,
        func: "readConfig",
        parameter: new Args(),
      });

      const bytes: Uint8Array = result.value;
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

      // Helper to read u32 length-prefixed UTF-8 string
      let offset = 0;
      const readU32 = () => {
        const v = dataView.getUint32(offset, true);
        offset += 4;
        return v;
      };
      const readString = () => {
        const len = readU32();
        const slice = bytes.slice(offset, offset + len);
        offset += len;
        return new TextDecoder().decode(slice);
      };
      const readU64 = () => {
        const low = dataView.getUint32(offset, true);
        const high = dataView.getUint32(offset + 4, true);
        offset += 8;
        return (BigInt(high) << 32n) + BigInt(low);
      };

      const cfgRecipient = readString();
      const cfgAmount = readU64();
      const cfgInterval = readU64();

      setReadConfigResult({
        recipient: cfgRecipient,
        amount: cfgAmount.toString(),
        interval: cfgInterval.toString(),
      });
    } catch (e: any) {
      setAutonomousError(e?.message || "Failed to read config.");
    } finally {
      setIsCalling(false);
    }
  };

  const handleCheckBalance = async () => {
    if (!autonomousAddress) {
      setAutonomousError("Please set the autonomous contract address first.");
      return;
    }

    setIsCheckingBalance(true);
    setAutonomousError(null);
    try {
      const response = await fetch(BUILDNET_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get_addresses",
          params: [[autonomousAddress]],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "RPC error while fetching balance");
      }

      const result = data.result;
      if (Array.isArray(result) && result.length > 0) {
        const info = result[0] as any;
        setAutonomousBalance({
          final: String(info.final_balance ?? "0"),
          candidate: String(info.candidate_balance ?? "0"),
        });
      } else {
        setAutonomousBalance(null);
        setAutonomousError("Address not found or no balance data returned.");
      }
    } catch (e: any) {
      setAutonomousError(e?.message || "Error fetching balance.");
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const handleUpdateConfig = async () => {
    if (!connectedAccount) {
      setAutonomousError("Please connect your wallet first.");
      return;
    }
    if (!autonomousAddress) {
      setAutonomousError("Please set the autonomous contract address first.");
      return;
    }

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const args = new Args();
      // For each field we send a bool flag + value, matching updateConfig implementation
      // recipient
      if (recipient.trim().length > 0) {
        args.addBool(true).addString(recipient.trim());
      } else {
        args.addBool(false);
      }
      // amount
      const trimmedAmount = amount.trim();
      if (trimmedAmount.length > 0) {
        const masAmount = Number(trimmedAmount);
        if (!Number.isFinite(masAmount) || Number.isNaN(masAmount) || masAmount < 0) {
          setAutonomousError("Invalid MAS amount.");
          setIsCalling(false);
          return;
        }
        const nanoAmount = BigInt(Math.round(masAmount * 1_000_000_000));
        args.addBool(true).addU64(nanoAmount);
      } else {
        args.addBool(false);
      }
      // interval (human units -> slots)
      const trimmedInterval = interval.trim();
      if (trimmedInterval.length > 0) {
        if (!intervalSlotsDisplay) {
          setAutonomousError("Please enter a valid interval.");
          setIsCalling(false);
          return;
        }
        const intervalSlots = BigInt(intervalSlotsDisplay);
        args.addBool(true).addU64(intervalSlots);
      } else {
        args.addBool(false);
      }

      const op = await (connectedAccount as any).callSC({
        target: autonomousAddress,
        func: "updateConfig",
        parameter: args,
      });

      setAutonomousStatus(`updateConfig sent. Operation ID: ${op.id}`);
      setAutonomousOperationId(op.id);
    } catch (e: any) {
      setAutonomousError(e?.message || "Failed to update config.");
    } finally {
      setIsCalling(false);
    }
  };

  const handleSimpleCall = async (func: string) => {
    if (!connectedAccount) {
      setAutonomousError("Please connect your wallet first.");
      return;
    }
    if (!autonomousAddress) {
      setAutonomousError("Please set the autonomous contract address first.");
      return;
    }

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const op = await (connectedAccount as any).callSC({
        target: autonomousAddress,
        func,
        parameter: new Args(),
      });
      setAutonomousStatus(`${func} sent. Operation ID: ${op.id}`);
      setAutonomousOperationId(op.id);
    } catch (e: any) {
      setAutonomousError(e?.message || `Failed to call ${func}.`);
    } finally {
      setIsCalling(false);
    }
  };

  const handleTransferMas = async () => {
    setTransferError(null);
    setTransferStatus(null);
    setTransferOperationId(null);

    if (!connectedAccount) {
      setTransferError("Please connect your wallet first.");
      return;
    }

    const recipient = transferRecipient.trim();
    if (recipient.length === 0) {
      setTransferError("Please enter a recipient address.");
      return;
    }

    const trimmedAmount = transferAmount.trim();
    if (trimmedAmount.length === 0) {
      setTransferError("Please enter an amount in MAS.");
      return;
    }

    const masAmount = Number(trimmedAmount);
    if (!Number.isFinite(masAmount) || Number.isNaN(masAmount) || masAmount <= 0) {
      setTransferError("Invalid MAS amount.");
      return;
    }

    const nanoAmount = BigInt(Math.round(masAmount * 1_000_000_000));

    setIsTransferring(true);
    try {
      setTransferStatus("Sending transfer from connected wallet...");

      const op = await (connectedAccount as any).transfer(recipient, nanoAmount, {
        fee: 10_000_000n,
      });

      setTransferStatus("Transfer sent.");
      setTransferOperationId(op.id);
    } catch (e: any) {
      setTransferError(e?.message || "Failed to send transfer.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-green-50 dark:bg-green-950">
      <Toaster richColors position="top-right" />
      <WalletConnect />

      <div className="rounded-xl border border-green-200 bg-white px-6 py-4 shadow-sm dark:border-green-800 dark:bg-green-900/50 max-w-xl w-full mx-4">
        <h2 className="mb-3 text-lg font-semibold text-green-950 dark:text-green-50">
          Debug: Transfer MAS
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Recipient address
            </span>
            <input
              type="text"
              className="rounded-md border border-green-200 px-2 py-1 text-xs font-mono text-black dark:border-green-700 dark:bg-green-950/40"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="Target Massa address"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Amount (MAS)
            </span>
            <input
              type="number"
              className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-700 dark:bg-green-950/40"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="e.g. 0.1"
            />
          </label>
        </div>

        <button
          onClick={handleTransferMas}
          disabled={!connectedAccount || isTransferring}
          className="mt-3 rounded-full bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-400"
        >
          {isTransferring ? "Transferring..." : "Send MAS"}
        </button>

        {transferStatus && (
          <p className="mt-2 text-xs text-green-700 dark:text-green-300">
            {transferStatus}
          </p>
        )}
        {transferOperationId && (
          <p className="mt-1 text-[11px] text-green-700 dark:text-green-300">
            <a
              href={`https://buildnet-explorer.massa.net/#explorer?explore=${transferOperationId}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono underline decoration-dotted underline-offset-2"
            >
              Operation ID: {transferOperationId}
            </a>
          </p>
        )}
        {transferError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{transferError}</p>
        )}
      </div>

      <div className="rounded-xl border border-green-200 bg-white px-6 py-4 shadow-sm dark:border-green-800 dark:bg-green-900/50 max-w-xl w-full mx-4">
        <h1 className="mb-3 text-lg font-semibold text-green-950 dark:text-green-50">
          Debug: Deploy main.wasm
        </h1>
        <button
          onClick={handleDeployMain}
          disabled={!connectedAccount || isDeployingMain}
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
        >
          {isDeployingMain ? "Deploying..." : "Deploy Contract"}
        </button>

        {mainStatus && (
          <p className="mt-3 text-sm text-green-700 dark:text-green-300">{mainStatus}</p>
        )}

        {contractAddress && (
          <p className="mt-2 text-sm text-green-900 dark:text-green-100 break-all">
            Contract address: <span className="font-mono">{contractAddress}</span>
          </p>
        )}

        {mainOperationId && (
          <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm dark:bg-green-950/40">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Operation ID
              </p>
              <a
                href={`https://buildnet-explorer.massa.net/#explorer?explore=${mainOperationId}`}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono text-gray-600 dark:text-gray-300 underline decoration-dotted underline-offset-2"
              >
                {mainOperationId}
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-300">Status:</span>
              <span
                className={`font-semibold ${
                  mainOperationStatus === OperationStatus.Success
                    ? "text-green-600"
                    : mainOperationStatus === OperationStatus.Error
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {mainOperationStatus ?? "pending..."}
              </span>
            </div>
          </div>
        )}

        {mainError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{mainError}</p>
        )}
      </div>

      <div className="rounded-xl border border-green-200 bg-white px-6 py-4 shadow-sm dark:border-green-800 dark:bg-green-900/50 max-w-2xl w-full mx-4 space-y-4">
        <h2 className="text-lg font-semibold text-green-950 dark:text-green-50">
          Debug: Autonomous contract (autonomous.wasm)
        </h2>

        <div className="rounded-lg border border-green-200 bg-green-50/60 p-3 text-xs text-green-950 dark:border-green-800 dark:bg-green-950/40 dark:text-green-50 space-y-2">
          <p className="font-semibold">Payout simulation (off-chain)</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-green-900 dark:text-green-100">
                Balance in MAS
              </span>
              <input
                type="number"
                className="rounded-md border border-green-200 px-2 py-1 text-[11px] text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                value={simBalanceMas}
                onChange={(e) => setSimBalanceMas(e.target.value)}
                placeholder="e.g. 2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-green-900 dark:text-green-100">
                Payout per interval (MAS)
              </span>
              <input
                type="number"
                className="rounded-md border border-green-200 px-2 py-1 text-[11px] text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                value={simPayoutPerIntervalMas}
                onChange={(e) => setSimPayoutPerIntervalMas(e.target.value)}
                placeholder="e.g. 0.1"
              />
            </label>
            <div className="flex flex-col justify-center text-[11px] text-green-900 dark:text-green-100">
              {simResult ? (
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Intervals:</span> {simResult.intervals}
                  </p>
                  <p>
                    <span className="font-semibold">Total sent:</span> {simResult.totalSent} MAS
                  </p>
                  <p>
                    <span className="font-semibold">Remaining:</span> {simResult.remaining} MAS
                  </p>
                  {simResult.totalPayout && simResult.fees && simResult.payoutPer && (
                    <>
                      <p>
                        <span className="font-semibold">Payout to freelancer:</span>{" "}
                        {simResult.intervals} × {simResult.payoutPer} = {simResult.totalPayout} MAS
                      </p>
                      <p>
                        <span className="font-semibold">Fees:</span>{" "}
                        {simResult.totalSent} − {simResult.totalPayout} = {simResult.fees} MAS
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p className="italic text-[11px] text-green-800/80 dark:text-green-200/80">
                  Enter balance and per-interval cost to see simulation.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Recipient address
            </span>
            <input
              type="text"
              className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-700 dark:bg-green-950/40"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Amount (MAS)
            </span>
            <input
              type="number"
              className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-700 dark:bg-green-950/40"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {nanoAmountDisplay && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                ≈ {nanoAmountDisplay} nanoMAS
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Interval
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-700 dark:bg-green-950/40"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              />
              <select
                className="rounded-md border border-green-200 bg-white px-2 py-1 text-xs text-black dark:border-green-700 dark:bg-green-950/60"
                value={intervalUnit}
                onChange={(e) => setIntervalUnit(e.target.value as any)}
              >
                <option value="minute">minutes</option>
                <option value="hour">hours</option>
                <option value="day">days</option>
                <option value="month">months</option>
              </select>
            </div>
            {intervalSlotsDisplay && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                ≈ {intervalSlotsDisplay} slots
              </span>
            )}
          </label>
        </div>

        <button
          onClick={handleDeployAutonomous}
          disabled={!connectedAccount || isDeployingAutonomous}
          className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
        >
          {isDeployingAutonomous ? "Deploying autonomous..." : "Deploy autonomous.wasm"}
        </button>

        <div className="mt-4 border-t border-green-200 pt-4 dark:border-green-800 space-y-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Autonomous contract address
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="rounded-md border border-green-200 px-2 py-1 text-xs font-mono text-black dark:border-green-700 dark:bg-green-950/40"
                value={autonomousAddress}
                onChange={(e) => setAutonomousAddress(e.target.value)}
                placeholder="Paste deployed autonomous contract address here"
              />
              <button
                type="button"
                onClick={handleCheckBalance}
                disabled={!autonomousAddress || isCheckingBalance}
                className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-800 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                {isCheckingBalance ? "Checking..." : "Check balance"}
              </button>
            </div>
            {autonomousBalance && (
              <p className="text-[11px] text-gray-600 dark:text-gray-300">
                Balance: final {autonomousBalance.final} MAS, candidate {" "}
                {autonomousBalance.candidate} MAS
              </p>
            )}
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReadConfig}
              disabled={!connectedAccount || isCalling}
              className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-50 dark:hover:bg-green-700"
            >
              Read config
            </button>
            <button
              onClick={handleUpdateConfig}
              disabled={!connectedAccount || isCalling}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-50 dark:hover:bg-blue-700"
            >
              Update config
            </button>
            <button
              onClick={() => handleSimpleCall("start")}
              disabled={!connectedAccount || isCalling}
              className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-50 dark:hover:bg-emerald-700"
            >
              Start
            </button>
            <button
              onClick={() => handleSimpleCall("stop")}
              disabled={!connectedAccount || isCalling}
              className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200 dark:bg-amber-800 dark:text-amber-50 dark:hover:bg-amber-700"
            >
              Stop
            </button>
            <button
              onClick={() => handleSimpleCall("withdrawMaxBalance")}
              disabled={!connectedAccount || isCalling}
              className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-50 dark:hover:bg-rose-700"
            >
              Withdraw max balance
            </button>
          </div>

          {readConfigResult && (
            <div className="rounded-lg bg-gray-50 p-3 text-xs dark:bg-green-950/40 space-y-1">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Recipient:
                </span>{" "}
                <span className="font-mono break-all text-gray-800 dark:text-gray-100">
                  {readConfigResult.recipient}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Amount (nanoMAS):
                </span>{" "}
                <span className="font-mono text-gray-800 dark:text-gray-100">
                  {readConfigResult.amount}
                </span>
              </div>
              {nanoToMas(readConfigResult.amount) && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Amount (MAS):
                  </span>{" "}
                  <span className="font-mono text-gray-800 dark:text-gray-100">
                    {nanoToMas(readConfigResult.amount)}
                  </span>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Interval (slots):
                </span>{" "}
                <span className="font-mono text-gray-800 dark:text-gray-100">
                  {readConfigResult.interval}
                </span>
              </div>
              {slotsToHuman(readConfigResult.interval) && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Interval (approx):
                  </span>{" "}
                  <span className="font-mono text-gray-800 dark:text-gray-100">
                    {slotsToHuman(readConfigResult.interval)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Autonomous events log
              </h3>
              <button
                type="button"
                onClick={handleFetchEvents}
                disabled={
                  !connectedAccount || !autonomousAddress || isFetchingEvents
                }
                className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-800 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                {isFetchingEvents ? "Loading..." : "Fetch events"}
              </button>
            </div>
            {eventsError && (
              <p className="text-[11px] text-red-600 dark:text-red-400">
                {eventsError}
              </p>
            )}
            <div className="max-h-40 overflow-y-auto rounded-md bg-gray-50 p-2 text-[11px] font-mono text-gray-800 dark:bg-green-950/40 dark:text-gray-100">
              {eventLogs.length === 0 ? (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  No events loaded yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {eventLogs.map((ev, idx) => (
                    <li key={`${ev.slot}-${idx}`} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        [{ev.isFinal ? "final" : "candidate"}]
                        {ev.isError ? " [error]" : ""} slot {ev.slot}
                      </span>
                      <span>{ev.data}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {autonomousOperationId && (
            <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 text-xs dark:bg-green-950/40">
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  Autonomous operation ID
                </p>
                <a
                  href={`https://buildnet-explorer.massa.net/#explorer?explore=${autonomousOperationId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-mono text-gray-600 dark:text-gray-300 underline decoration-dotted underline-offset-2"
                >
                  {autonomousOperationId}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-300">Status:</span>
                <span
                  className={`font-semibold ${
                    autonomousOperationStatus === OperationStatus.Success
                      ? "text-green-600"
                      : autonomousOperationStatus === OperationStatus.Error
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {autonomousOperationStatus ?? "pending..."}
                </span>
              </div>
            </div>
          )}

          {autonomousStatus && (
            <p className="text-xs text-green-700 dark:text-green-300">
              {autonomousStatus}
            </p>
          )}

          {isCalling && (
            <p className="text-xs text-gray-500 dark:text-gray-300">
              Sending transaction / reading contract...
            </p>
          )}

          {autonomousError && (
            <p className="text-xs text-red-600 dark:text-red-400">{autonomousError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
*/
