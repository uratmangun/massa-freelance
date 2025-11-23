'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccountStore } from '@massalabs/react-ui-kit';
import WalletConnect from '../components/WalletConnect';

export default function Hire() {
  const { connectedAccount } = useAccountStore();
  const [jobs, setJobs] = useState<any[]>([]);

  const [isPosting, setIsPosting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('');
  const [intervalUnit, setIntervalUnit] = useState<'minute' | 'hour' | 'day' | 'month'>('hour');

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

  const handleDelete = async (id: number) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
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
      const res = await fetch('/api/jobs', {
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
        const res = await fetch('/api/jobs');
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
                <button 
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                  className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30"
                >
                  {deletingId === job.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
              <p className="mt-4 text-green-900/80 dark:text-green-100/80">
                {job.description}
              </p>
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
