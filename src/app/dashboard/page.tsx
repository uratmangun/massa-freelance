'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WalletConnect from '../components/WalletConnect';

type Job = {
  id: number;
  title: string;
  pay: string;
  description: string;
  walletAddress: string;
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        console.error('Error loading jobs', err);
        setError(err?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      {/* Header */}
      <header className="border-b border-green-200 bg-white px-6 py-4 dark:border-green-900 dark:bg-green-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-950 dark:text-green-50">
            Massa Freelance
          </Link>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-bold text-green-950 dark:text-green-50">
          Available Jobs
        </h1>

        {loading && (
          <p className="mb-4 text-sm text-green-800/70 dark:text-green-200/70">
            Loading jobs...
          </p>
        )}
        {error && !loading && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-green-800 dark:bg-green-900/50"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-green-950 dark:text-green-50">
                    {job.title}
                  </h2>
                  <p className="text-sm text-green-800/70 dark:text-green-200/70">
                    Posted by {job.walletAddress}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-900 dark:bg-green-900/50 dark:text-green-100">
                    {job.pay}
                  </div>
                  <button className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-50 dark:border-green-800 dark:text-green-100 dark:hover:bg-green-900/50">
                    Apply
                  </button>
                </div>
              </div>
              <p className="mt-4 text-green-900/80 dark:text-green-100/80">
                {job.description}
              </p>
            </div>
          ))}
          {!loading && jobs.length === 0 && !error && (
            <p className="text-green-500 dark:text-green-400">
              No jobs posted yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
