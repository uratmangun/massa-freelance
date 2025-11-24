'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAccountStore } from '@massalabs/react-ui-kit';
import { Args, OperationStatus } from '@massalabs/massa-web3';
import WalletConnect from '../../../components/WalletConnect';

const BUILDNET_RPC_URL = 'https://buildnet.massa.net/api/v2';

interface Applicant {
  id: number;
  jobId: number;
  name: string;
  email: string;
  coverLetter: string;
  walletAddress: string;
  appliedAt: string;
  status: 'pending' | 'hired' | 'rejected';
}

interface Job {
  amountMas: string;
  id: number;
  title: string;
  description: string;
  amount: string;
  intervalValue: string;
  intervalUnit: string;
  walletAddress: string;
  contractAddress?: string | null;
  createdAt: string;
}

export default function JobApplicants() {
  const { connectedAccount } = useAccountStore();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [contractBalance, setContractBalance] = useState<{ final: string; candidate: string } | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [autonomousStatus, setAutonomousStatus] = useState<string | null>(null);
  const [autonomousError, setAutonomousError] = useState<string | null>(null);
  const [autonomousOperationId, setAutonomousOperationId] = useState<string | null>(null);
  const [autonomousOperationStatus, setAutonomousOperationStatus] = useState<OperationStatus | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isRunning, setIsRunning] = useState<boolean | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [cfgRecipient, setCfgRecipient] = useState('');
  const [cfgAmountMasInput, setCfgAmountMasInput] = useState('');
  const [cfgIntervalInput, setCfgIntervalInput] = useState('');
  const [cfgIntervalUnit, setCfgIntervalUnit] = useState<'minute' | 'hour' | 'day' | 'month'>('hour');

  const jobIntervalSlots = useMemo(() => {
    if (!job) return null;
    const value = Number(job.intervalValue);
    if (!Number.isFinite(value) || Number.isNaN(value) || value <= 0) return null;

    let slotsPerUnit: number;
    switch (job.intervalUnit) {
      case 'minute':
        slotsPerUnit = 4;
        break;
      case 'hour':
        slotsPerUnit = 4 * 60;
        break;
      case 'day':
        slotsPerUnit = 4 * 60 * 24;
        break;
      case 'month':
        slotsPerUnit = 4 * 60 * 24 * 30;
        break;
      default:
        slotsPerUnit = 1;
    }

    const slots = Math.round(value * slotsPerUnit);
    return slots.toString();
  }, [job]);

  const jobSimResult = useMemo(() => {
    if (!job || !contractBalance) return null;

    const balanceTrimmed = String(contractBalance.final ?? '').trim();
    const payoutTrimmed = String(job.amountMas ?? '').trim();
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
        totalSent: '0.000000',
        remaining: effectiveBalance.toFixed(6),
        totalPayout: '0.000000',
        fees: '0.000000',
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
  }, [job, contractBalance]);

  const cfgIntervalSlotsDisplay = useMemo(() => {
    const trimmed = cfgIntervalInput.trim();
    if (trimmed.length === 0) return '';

    const value = Number(trimmed);
    if (!Number.isFinite(value) || Number.isNaN(value) || value <= 0) return '';

    let slotsPerUnit: number;
    switch (cfgIntervalUnit) {
      case 'minute':
        slotsPerUnit = 4;
        break;
      case 'hour':
        slotsPerUnit = 4 * 60;
        break;
      case 'day':
        slotsPerUnit = 4 * 60 * 24;
        break;
      case 'month':
        slotsPerUnit = 4 * 60 * 24 * 30;
        break;
      default:
        slotsPerUnit = 1;
    }

    const slots = Math.round(value * slotsPerUnit);
    return slots.toString();
  }, [cfgIntervalInput, cfgIntervalUnit]);

  const canStartAutonomous =
    !!job &&
    !!job.contractAddress &&
    !!contractBalance &&
    !!jobIntervalSlots &&
    !!jobSimResult &&
    jobSimResult.intervals > 0;

  const isOperationPending =
    autonomousOperationStatus !== null &&
    autonomousOperationStatus !== OperationStatus.Success &&
    autonomousOperationStatus !== OperationStatus.Error;

  const handleReadConfig = async () => {
    if (!connectedAccount) {
      setAutonomousError('Please connect your wallet first.');
      return;
    }
    if (!job || !job.contractAddress) {
      setAutonomousError('No contract address for this job.');
      return;
    }

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const result = await (connectedAccount as any).readSC({
        target: job.contractAddress,
        func: 'readConfig',
        parameter: new Args(),
      });

      const bytes: Uint8Array = result.value;
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

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

      const recipientFromConfig = readString();
      const cfgAmount = readU64();
      const cfgInterval = readU64();

      // keep local form state in sync with on-chain config recipient
      setCfgRecipient(recipientFromConfig);

      setAutonomousStatus(
        `Config — recipient: ${recipientFromConfig}, amount (nanoMAS): ${cfgAmount.toString()}, interval (slots): ${cfgInterval.toString()}`,
      );
    } catch (e: any) {
      setAutonomousError(e?.message || 'Failed to read config.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleUpdateConfigForJob = async () => {
    if (!connectedAccount) {
      setAutonomousError('Please connect your wallet first.');
      return;
    }
    if (!job || !job.contractAddress) {
      setAutonomousError('No contract address for this job.');
      return;
    }
    if (isCalling || isOperationPending) return;

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const args = new Args();
      // recipient
      if (cfgRecipient.trim().length > 0) {
        args.addBool(true).addString(cfgRecipient.trim());
      } else {
        args.addBool(false);
      }

      // amount (MAS -> nanoMAS)
      const trimmedAmount = cfgAmountMasInput.trim();
      if (trimmedAmount.length > 0) {
        const masAmount = Number(trimmedAmount);
        if (!Number.isFinite(masAmount) || Number.isNaN(masAmount) || masAmount < 0) {
          setAutonomousError('Invalid MAS amount.');
          setIsCalling(false);
          return;
        }
        const nanoAmount = BigInt(Math.round(masAmount * 1_000_000_000));
        args.addBool(true).addU64(nanoAmount);
      } else {
        args.addBool(false);
      }

      // interval (human units -> slots)
      const trimmedInterval = cfgIntervalInput.trim();
      if (trimmedInterval.length > 0) {
        if (!cfgIntervalSlotsDisplay) {
          setAutonomousError('Please enter a valid interval.');
          setIsCalling(false);
          return;
        }
        const slotsNum = Number(cfgIntervalSlotsDisplay);
        if (!Number.isFinite(slotsNum) || Number.isNaN(slotsNum) || slotsNum <= 0) {
          setAutonomousError('Please enter a valid interval.');
          setIsCalling(false);
          return;
        }
        const slots = BigInt(slotsNum);
        args.addBool(true).addU64(slots);
      } else {
        args.addBool(false);
      }

      const op = await (connectedAccount as any).callSC({
        target: job.contractAddress,
        func: 'updateConfig',
        parameter: args,
      });

      setAutonomousStatus(`updateConfig sent. Operation ID: ${op.id}`);
      setAutonomousOperationId(op.id);

      const status = await waitForOperationFinalization(op.id);
      if (status !== OperationStatus.Success) {
        setAutonomousError('updateConfig operation failed or not finalized.');
      }
    } catch (e: any) {
      setAutonomousError(e?.message || 'Failed to update config.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleUpdateRecipientForApplicant = async (applicant: Applicant) => {
    if (!connectedAccount) {
      setAutonomousError('Please connect your wallet first.');
      return;
    }
    if (!job || !job.contractAddress) {
      setAutonomousError('No contract address for this job.');
      return;
    }
    if (isCalling || isOperationPending) return;

    setIsCalling(true);
    setAutonomousError(null);
    try {
      const args = new Args();
      // update only recipient to applicant wallet, keep amount & interval unchanged
      args.addBool(true).addString(applicant.walletAddress);
      args.addBool(false);
      args.addBool(false);

      const op = await (connectedAccount as any).callSC({
        target: job.contractAddress,
        func: 'updateConfig',
        parameter: args,
      });

      setAutonomousStatus(`updateConfig (recipient) sent. Operation ID: ${op.id}`);
      setAutonomousOperationId(op.id);

      const status = await waitForOperationFinalization(op.id);
      if (status === OperationStatus.Success) {
        setCfgRecipient(applicant.walletAddress);
      } else if (status !== null) {
        setAutonomousError('updateConfig operation failed or not finalized.');
      }
    } catch (e: any) {
      setAutonomousError(e?.message || 'Failed to update recipient in config.');
    } finally {
      setIsCalling(false);
    }
  };

  const waitForOperationFinalization = async (
    opId: string,
  ): Promise<OperationStatus | null> => {
    if (!connectedAccount) return null;
    try {
      // Long-poll operation status (up to ~5 minutes: 150 * 2s)
      for (let i = 0; i < 150; i++) {
        const status = await (connectedAccount as any).getOperationStatus(opId);
        setAutonomousOperationStatus(status);

        if (
          status === OperationStatus.Success ||
          status === OperationStatus.Error
        ) {
          return status;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.error('Failed to poll operation status', e);
    }
    return null;
  };

  const handleStartForApplicant = async (applicant: Applicant) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!job || !job.contractAddress) {
      alert('No contract address for this job.');
      return;
    }
    if (!canStartAutonomous) {
      setAutonomousError(
        'Not enough balance or invalid configuration to start autonomous payments.',
      );
      return;
    }
    if (isCalling) return;

    setIsCalling(true);
    setAutonomousError(null);
    setAutonomousStatus(null);

    try {
      const args = new Args();
      args.addBool(true).addString(applicant.walletAddress);
      args.addBool(false);
      args.addBool(false);

      const updateOp = await (connectedAccount as any).callSC({
        target: job.contractAddress,
        func: 'updateConfig',
        parameter: args,
      });

      setAutonomousStatus(`updateConfig sent. Operation ID: ${updateOp.id}`);
      setAutonomousOperationId(updateOp.id);

      const updateStatus = await waitForOperationFinalization(updateOp.id);
      if (updateStatus !== OperationStatus.Success) {
        setAutonomousError('updateConfig operation failed or not finalized.');
        return;
      }

      const startOp = await (connectedAccount as any).callSC({
        target: job.contractAddress,
        func: 'start',
        parameter: new Args(),
      });

      setAutonomousStatus(`start sent. Operation ID: ${startOp.id}`);
      setAutonomousOperationId(startOp.id);

      const startStatus = await waitForOperationFinalization(startOp.id);
      if (startStatus === OperationStatus.Success) {
        setIsRunning(true);
      } else {
        setAutonomousError('start operation failed or not finalized.');
      }
    } catch (e: any) {
      setAutonomousError(e?.message || 'Error starting autonomous contract.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleStopAutonomous = async () => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!job || !job.contractAddress) {
      alert('No contract address for this job.');
      return;
    }
    if (isCalling) return;

    setIsCalling(true);
    setAutonomousError(null);

    try {
      const op = await (connectedAccount as any).callSC({
        target: job.contractAddress,
        func: 'stop',
        parameter: new Args(),
      });

      setAutonomousStatus(`stop sent. Operation ID: ${op.id}`);
      setAutonomousOperationId(op.id);

      const stopStatus = await waitForOperationFinalization(op.id);
      if (stopStatus === OperationStatus.Success) {
        setIsRunning(false);
      } else {
        setAutonomousError('stop operation failed or not finalized.');
      }
    } catch (e: any) {
      setAutonomousError(e?.message || 'Error stopping autonomous contract.');
    } finally {
      setIsCalling(false);
    }
  };

  const fetchContractBalance = async (address: string) => {
    setIsCheckingBalance(true);
    setBalanceError(null);
    try {
      const response = await fetch(BUILDNET_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'get_addresses',
          params: [[address]],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'RPC error while fetching balance');
      }

      const result = data.result;
      if (Array.isArray(result) && result.length > 0) {
        const info = result[0] as any;
        setContractBalance({
          final: String(info.final_balance ?? '0'),
          candidate: String(info.candidate_balance ?? '0'),
        });
      } else {
        setContractBalance(null);
        setBalanceError('Address not found or no balance data returned.');
      }
    } catch (e: any) {
      setBalanceError(e?.message || 'Error fetching balance.');
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const withdrawContractBalance = async (address: string) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setIsWithdrawing(true);
    setBalanceError(null);
    try {
      const op = await (connectedAccount as any).callSC({
        target: address,
        func: 'withdrawMaxBalance',
        parameter: new Args(),
      });

      console.log('withdrawMaxBalance operation sent', op.id);
      await fetchContractBalance(address);
    } catch (e: any) {
      console.error('Error withdrawing contract balance:', e);
      setBalanceError(e?.message || 'Failed to withdraw contract balance.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        // Fetch job details
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        if (jobRes.ok) {
          const jobData = await jobRes.json();
          setJob(jobData);

          if (jobData.contractAddress) {
            await fetchContractBalance(jobData.contractAddress);
          } else {
            setContractBalance(null);
            setBalanceError(null);
          }
        }

        // Fetch applicants (mock data for now)
        // In a real app, this would be: const applicantsRes = await fetch(`/api/jobs/${jobId}/applicants`);
        const applicantsRes = await fetch(`/api/jobs/${jobId}/applicants`);
        if (applicantsRes.ok) {
          const applicantsData: Applicant[] = await applicantsRes.json();
          setApplicants(applicantsData);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobAndApplicants();
    }
  }, [jobId]);

  const handleHire = async (applicantId: number) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setHiringId(applicantId);
    try {
      // In a real app, this would call your API
      // await fetch(`/api/applicants/${applicantId}/hire`, { method: 'POST' });

      const res = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'hired' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Failed to hire freelancer.');
        return;
      }

      // Update local state
      setApplicants(prev => 
        prev.map(applicant => 
          applicant.id === applicantId 
            ? { ...applicant, status: 'hired' as const }
            : applicant
        )
      );

      alert(`Freelancer hired successfully! They can now start working.`);
    } catch (error) {
      console.error('Error hiring freelancer:', error);
      alert('Failed to hire freelancer.');
    } finally {
      setHiringId(null);
    }
  };

  const handleReject = async (applicantId: number) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setRejectingId(applicantId);
    try {
      // In a real app, this would call your API
      // await fetch(`/api/applicants/${applicantId}/reject`, { method: 'POST' });

      const res = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Failed to reject application.');
        return;
      }

      // Update local state
      setApplicants(prev => 
        prev.map(applicant => 
          applicant.id === applicantId 
            ? { ...applicant, status: 'rejected' as const }
            : applicant
        )
      );

      alert('Application rejected.');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application.');
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <p className="text-green-900 dark:text-green-50">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-green-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Job not found</p>
          <Link 
            href="/hire" 
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      {/* Header */}
      <header className="border-b border-green-200 bg-white px-6 py-4 dark:border-green-800 dark:bg-green-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/hire" 
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              ← Back to Jobs
            </Link>
            <h1 className="text-xl font-bold text-green-950 dark:text-green-50">
              Job Applicants
            </h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Job Details */}
        <div className="mb-8 rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-green-900/50">
          <h2 className="mb-4 text-2xl font-bold text-green-950 dark:text-green-50">
            {job.title}
          </h2>
          <p className="mb-4 text-green-900/80 dark:text-green-100/80">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 rounded-full">
              {job.amountMas} MAS per {job.intervalValue} {job.intervalUnit}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 rounded-full">
              {applicants.filter(a => a.status === 'pending').length} pending applicants
            </span>
            {job.contractAddress && (
              <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-full">
                <span>Contract:</span>
                <a
                  href={`https://buildnet-explorer.massa.net/#explorer?explore=${job.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono underline decoration-dotted underline-offset-2"
                >
                  {job.contractAddress.slice(0, 10)}...
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(job.contractAddress!);
                    } catch (e) {
                      console.error('Failed to copy address', e);
                    }
                  }}
                  className="ml-1 rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-50 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800/80"
                >
                  Copy
                </button>
              </span>
            )}
            {job.contractAddress && contractBalance && (
              <>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-full">
                  Balance: {contractBalance.final} MAS
                </span>
                <button
                  type="button"
                  onClick={() => fetchContractBalance(job.contractAddress!)}
                  disabled={isCheckingBalance}
                  className="px-3 py-1 text-[11px] rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800/70"
                >
                  {isCheckingBalance ? 'Refreshing...' : 'Refresh balance'}
                </button>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    className="w-40 rounded-md border border-green-200 px-2 py-1 text-[11px] font-mono text-black dark:border-green-700 dark:bg-green-950/40 dark:text-white"
                    value={cfgRecipient}
                    onChange={(e) => setCfgRecipient(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Amount (MAS)"
                    className="w-24 rounded-md border border-green-200 px-2 py-1 text-[11px] text-black dark:border-green-700 dark:bg-green-950/40 dark:text-white"
                    value={cfgAmountMasInput}
                    onChange={(e) => setCfgAmountMasInput(e.target.value)}
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Interval"
                      className="w-20 rounded-md border border-green-200 px-2 py-1 text-[11px] text-black dark:border-green-700 dark:bg-green-950/40 dark:text-white"
                      value={cfgIntervalInput}
                      onChange={(e) => setCfgIntervalInput(e.target.value)}
                    />
                    <select
                      className="rounded-md border border-green-200 bg-white px-2 py-1 text-[11px] text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                      value={cfgIntervalUnit}
                      onChange={(e) => setCfgIntervalUnit(e.target.value as any)}
                    >
                      <option value="minute">min</option>
                      <option value="hour">hour</option>
                      <option value="day">day</option>
                      <option value="month">month</option>
                    </select>
                    {cfgIntervalSlotsDisplay && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300">
                        ≈ {cfgIntervalSlotsDisplay} slots
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleReadConfig}
                    disabled={!connectedAccount || isCalling}
                    className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-50 dark:hover:bg-green-700"
                  >
                    Read config
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateConfigForJob}
                    disabled={!connectedAccount || isCalling || isOperationPending}
                    className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-50 dark:hover:bg-blue-700"
                  >
                    Update config
                  </button>
                  <button
                    type="button"
                    onClick={() => withdrawContractBalance(job.contractAddress!)}
                    disabled={!connectedAccount || isWithdrawing || isOperationPending}
                    className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-medium text-rose-800 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-50 dark:hover:bg-rose-700"
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw max balance'}
                  </button>
                </div>
              </>
            )}
            {job.contractAddress && !contractBalance && isCheckingBalance && (
              <span className="px-3 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-full">
                Checking balance...
              </span>
            )}
          </div>
          {job.contractAddress && balanceError && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              {balanceError}
            </p>
          )}
          {autonomousStatus && (
            <p className="mt-2 text-xs text-green-700 dark:text-green-300">
              {autonomousStatus}
            </p>
          )}
          {autonomousError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {autonomousError}
            </p>
          )}
        </div>

        {/* Applicants List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-green-950 dark:text-green-50">
            Applicants ({applicants.length})
          </h3>

          {applicants.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-green-200 bg-white dark:border-green-800 dark:bg-green-900/50">
              <p className="text-green-500 dark:text-green-400">
                No applicants yet for this job.
              </p>
            </div>
          ) : (
            applicants.map((applicant) => {
              const isRecipientMatch =
                cfgRecipient.trim().length > 0 &&
                cfgRecipient.trim() === applicant.walletAddress;

              const uiStatus =
                applicant.status === 'rejected'
                  ? 'rejected'
                  : isRecipientMatch
                  ? 'hired'
                  : 'pending';

              const statusClass =
                uiStatus === 'hired'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                  : uiStatus === 'rejected'
                  ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';

              return (
              <div
                key={applicant.id}
                className={`rounded-xl border p-6 shadow-sm transition-shadow ${
                  applicant.status === 'hired' 
                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/70'
                    : applicant.status === 'rejected'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    : 'border-green-200 bg-white hover:shadow-md dark:border-green-800 dark:bg-green-900/50'
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-green-950 dark:text-green-50">
                        {applicant.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                        {uiStatus}
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <span>{applicant.email}</span>
                      <a
                        href={`https://buildnet-explorer.massa.net/#explorer?explore=${applicant.walletAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono underline decoration-dotted underline-offset-2"
                      >
                        Wallet: {applicant.walletAddress.slice(0, 10)}...
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(applicant.walletAddress);
                          } catch (e) {
                            console.error('Failed to copy address', e);
                          }
                        }}
                        className="ml-1 rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-50 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800/80"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                        Cover Letter:
                      </h5>
                      <p className="text-green-900/80 dark:text-green-100/80 whitespace-pre-wrap">
                        {applicant.coverLetter}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:ml-4">
                    {applicant.status === 'pending' && (
                      <>
                        {job.contractAddress &&
                          canStartAutonomous &&
                          !isRunning &&
                          (cfgRecipient.trim().length === 0 ||
                            cfgRecipient.trim() === applicant.walletAddress) && (
                            <button
                              onClick={() => handleStartForApplicant(applicant)}
                              disabled={!connectedAccount || isCalling || isOperationPending}
                              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-400"
                            >
                              {isCalling ? 'Starting...' : 'Start autonomous payments'}
                            </button>
                          )}
                        {job.contractAddress &&
                          !isRunning &&
                          cfgRecipient.trim().length > 0 &&
                          cfgRecipient.trim() !== applicant.walletAddress && (
                            <button
                              onClick={() => handleUpdateRecipientForApplicant(applicant)}
                              disabled={!connectedAccount || isCalling || isOperationPending}
                              className="px-6 py-2 text-xs font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-800 dark:text-blue-50 dark:hover:bg-blue-700"
                            >
                              Update wallet in config
                            </button>
                          )}
                        {job.contractAddress && isRunning && (
                          <button
                            onClick={handleStopAutonomous}
                            disabled={!connectedAccount || isCalling || isOperationPending}
                            className="px-6 py-2 text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-800 dark:text-amber-50 dark:hover:bg-amber-700"
                          >
                            {isCalling ? 'Stopping...' : 'Stop autonomous payments'}
                          </button>
                        )}
                        {!job.contractAddress && (
                          <div className="px-6 py-2 text-xs text-slate-600 bg-slate-100 rounded-full text-center dark:bg-slate-800 dark:text-slate-200">
                            No contract address for this job.
                          </div>
                        )}
                        {job.contractAddress && !canStartAutonomous && (
                          <div className="px-6 py-2 text-xs text-slate-600 bg-slate-100 rounded-full text-center dark:bg-slate-800 dark:text-slate-200">
                            Not enough balance or invalid config to start.
                          </div>
                        )}
                      </>
                    )}
                    {applicant.status === 'hired' && (
                      <div className="px-6 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full text-center dark:bg-green-800 dark:text-green-200">
                        ✓ Hired
                      </div>
                    )}
                    {applicant.status === 'rejected' && (
                      <div className="px-6 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-full text-center dark:bg-red-800 dark:text-red-200">
                        ✗ Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </main>
    </div>
  );
}
