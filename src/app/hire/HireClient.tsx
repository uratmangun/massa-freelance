'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccountStore } from '@massalabs/react-ui-kit';
import { SmartContract, Args } from '@massalabs/massa-web3';
import WalletConnect from '../components/WalletConnect';
import { apiFetch } from '../lib/api';

function HireClient() {
  const { connectedAccount } = useAccountStore();
  const [jobs, setJobs] = useState<any[]>([]);

  const [isPosting, setIsPosting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('');
  const [intervalUnit, setIntervalUnit] = useState<'minute' | 'hour' | 'day' | 'month'>('hour');
  const [simBalanceMas, setSimBalanceMas] = useState('');
  const [simPayoutPerIntervalMas, setSimPayoutPerIntervalMas] = useState('');

  const nanoAmountDisplay =
    amount.trim().length === 0 || Number.isNaN(Number(amount))
      ? ''
      : Math.round(Number(amount) * 1_000_000_000).toString();

  const intervalSlotsDisplay = (() => {
    const trimmed = interval.trim();
    if (trimmed.length === 0) return '';

    const value = Number(trimmed);
    if (!Number.isFinite(value) || Number.isNaN(value) || value <= 0) return '';

    let slotsPerUnit: number;
    switch (intervalUnit) {
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
  })();

  const handleDelete = async (id: number) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setDeletingId(id);
    try {
      const res = await apiFetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Failed to remove job.');
        return;
      }

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error('Error deleting job', error);
      alert('Failed to remove job.');
    } finally {
      setDeletingId((current) => (current === id ? null : current));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const amountValue = (formData.get('amount') as string) || '';
    const intervalValue = (formData.get('interval') as string) || '';
    const unitValue = (formData.get('intervalUnit') as string) || intervalUnit;

    if (!amountValue || !intervalValue) {
      alert('Please fill in amount and interval.');
      return;
    }

    setIsPosting(true);
    try {
      // First deploy the autonomous smart contract for this job
      let contractAddress: string | null = null;
      try {
        const wasmRes = await fetch('/autonomous.wasm');
        if (!wasmRes.ok) {
          throw new Error('Failed to fetch /autonomous.wasm');
        }

        const wasmBuffer = await wasmRes.arrayBuffer();
        const wasmBytes = new Uint8Array(wasmBuffer);

        const masAmount = Number(amountValue);
        if (!Number.isFinite(masAmount) || Number.isNaN(masAmount) || masAmount < 0) {
          alert('Invalid MAS amount.');
          return;
        }
        const nanoAmount = BigInt(Math.round(masAmount * 1_000_000_000));

        if (!intervalSlotsDisplay) {
          alert('Please enter a valid interval.');
          return;
        }
        const intervalSlots = BigInt(intervalSlotsDisplay);

        const args = new Args();
        // 1) recipient address (string) - start with employer, can be updated later
        // 2) amount per transfer (u64 nanoMAS)
        // 3) interval in slots (u64)
        args.addString(connectedAccount.address);
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
          },
        );

        const addr =
          (sc as any).address?.toString?.() ?? String((sc as any).address ?? '');
        if (!addr) {
          throw new Error('Failed to obtain contract address from deployment.');
        }
        contractAddress = addr;
      } catch (err: any) {
        console.error('Error deploying autonomous contract', err);
        alert(err?.message || 'Failed to deploy autonomous contract.');
        return;
      }

      const res = await apiFetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          amount: amountValue,
          intervalValue,
          intervalUnit: unitValue,
          walletAddress: connectedAccount.address,
          contractAddress,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Failed to post job.');
        return;
      }

      const created = await res.json();
      setJobs((prev) => [created, ...prev]);

      form.reset();
      setAmount('');
      setInterval('');
      setIntervalUnit('hour');
    } catch (error) {
      console.error('Error creating job', error);
      alert('Failed to post job.');
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await apiFetch('/api/jobs');
        if (!res.ok) return;
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error loading jobs', error);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      {/* Header */}
      <header className="border-b border-green-200 bg-white px-6 py-4 dark:border-green-800 dark:bg-green-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-950 dark:text-green-50">
            Massa Freelance
          </Link>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-green-950 dark:text-green-50">
          Hire Talent
        </h1>

        {/* Post a Job Form */}
        <div className="mb-12 rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-green-900/50">
          <h2 className="mb-6 text-xl font-semibold text-green-950 dark:text-green-50">Post a New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-green-900 dark:text-green-100">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm text-black placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-800 dark:bg-green-950 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                placeholder="e.g. Smart Contract Auditor"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-green-900 dark:text-green-100">
                Pay Rate
              </span>
              <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-green-900 dark:text-green-100">
                    Amount (MAS)
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-800 dark:bg-green-950/40 dark:text-white"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {nanoAmountDisplay && (
                    <span className="text-[10px] text-green-700 dark:text-green-300">
                      ≈ {nanoAmountDisplay} nanoMAS
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-green-900 dark:text-green-100">
                    Interval
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="interval"
                      name="interval"
                      required
                      className="rounded-md border border-green-200 px-2 py-1 text-xs text-black dark:border-green-800 dark:bg-green-950/40 dark:text-white"
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                    />
                    <select
                      id="intervalUnit"
                      name="intervalUnit"
                      className="rounded-md border border-green-200 bg-white px-2 py-1 text-xs text-black dark:border-green-800 dark:bg-green-950/60 dark:text-white"
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
                    <span className="text-[10px] text-green-700 dark:text-green-300">
                      ≈ {intervalSlotsDisplay} slots
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-3 rounded-lg border border-green-200 bg-green-50/60 p-3 text-xs text-green-950 dark:border-green-800 dark:bg-green-950/40 dark:text-green-50 space-y-2">
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
                              <span className="font-semibold">Payout to freelancer:</span>{' '}
                              {simResult.intervals} * {simResult.payoutPer} = {simResult.totalPayout} MAS
                            </p>
                            <p>
                              <span className="font-semibold">Fees:</span>{' '}
                              {simResult.totalSent} - {simResult.totalPayout} = {simResult.fees} MAS
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
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-green-900 dark:text-green-100">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm text-black placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-800 dark:bg-green-950 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                placeholder="Describe the job requirements..."
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={!connectedAccount || isPosting}
                className="w-full rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:text-white dark:hover:bg-green-400"
              >
                {isPosting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>

        {/* Your Posted Jobs */}
        <h2 className="mb-6 text-2xl font-bold text-green-950 dark:text-green-50">Your Posted Jobs</h2>
        <div className="grid gap-6">
          {jobs
            .filter((job) =>
              connectedAccount?.address
                ? job.walletAddress === connectedAccount.address
                : true,
            )
            .map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-green-800 dark:bg-green-900/50"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-green-950 dark:text-green-50">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {job.pay}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/hire/${job.id}/applicants`}
                      className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-50 text-center dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30"
                    >
                      View Applicants
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30"
                    >
                      {deletingId === job.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-green-900/80 dark:text-green-100/80">
                  {job.description}
                </p>
                {job.contractAddress && (
                  <p className="mt-2 text-[11px] text-green-800 dark:text-green-200 break-all">
                    <a
                      href={`https://buildnet-explorer.massa.net/#explorer?explore=${job.contractAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono underline decoration-dotted underline-offset-2"
                    >
                      Contract: {job.contractAddress}
                    </a>
                  </p>
                )}
              </div>
            ))}
          {jobs.length === 0 && (
            <p className="text-center text-green-500 dark:text-green-400">
              You haven't posted any jobs yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default HireClient;
