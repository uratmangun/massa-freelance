'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccountStore } from '@massalabs/react-ui-kit';
import WalletConnect from '../components/WalletConnect';

type Job = {
  id: number;
  title: string;
  pay: string;
  description: string;
  walletAddress: string;
  contractAddress?: string | null;
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { connectedAccount } = useAccountStore();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

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

  const openApplyModal = (job: Job) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    setSelectedJob(job);
    setApplicantName('');
    setApplicantEmail('');
    setCoverLetter('');
    setPayoutAddress(connectedAccount.address || '');
    setApplyError(null);
    setIsApplyOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyOpen(false);
    setSelectedJob(null);
  };

  const handleSubmitApplication = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!applicantName || !applicantEmail || !coverLetter) {
      setApplyError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setApplyError(null);

    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}/applicants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: applicantName,
          email: applicantEmail,
          coverLetter,
          walletAddress: payoutAddress || connectedAccount.address,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setApplyError(data?.error || 'Failed to submit application.');
        return;
      }

      alert('Application submitted successfully.');
      closeApplyModal();
    } catch (err) {
      console.error('Error submitting application', err);
      setApplyError('Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  {job.contractAddress && (
                    <p className="mt-1 text-xs text-green-900/80 dark:text-green-100/80 break-all">
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
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-900 dark:bg-green-900/50 dark:text-green-100">
                    {job.pay}
                  </div>
                  {connectedAccount?.address !== job.walletAddress && (
                    <button
                      className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-50 dark:border-green-800 dark:text-green-100 dark:hover:bg-green-900/50"
                      onClick={() => openApplyModal(job)}
                    >
                      Apply
                    </button>
                  )}
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

      {isApplyOpen && selectedJob && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-green-900">
            <h2 className="mb-2 text-xl font-semibold text-green-950 dark:text-green-50">
              Apply for {selectedJob.title}
            </h2>
            <p className="mb-2 text-sm text-green-800/80 dark:text-green-200/80">
              Choose the address where you want to receive payouts.
            </p>
            <p className="mb-2 text-xs text-green-800/70 dark:text-green-200/70">
              Default wallet: <span className="font-mono">{connectedAccount?.address}</span>
            </p>
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-green-900 dark:text-green-100">Payout address</span>
                <input
                  type="text"
                  className="rounded-md border border-green-200 px-3 py-2 text-sm text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                  value={payoutAddress}
                  onChange={(e) => setPayoutAddress(e.target.value)}
                  placeholder={connectedAccount?.address}
                  required
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-green-900 dark:text-green-100">Name</span>
                  <input
                    type="text"
                    className="rounded-md border border-green-200 px-3 py-2 text-sm text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-green-900 dark:text-green-100">Email</span>
                  <input
                    type="email"
                    className="rounded-md border border-green-200 px-3 py-2 text-sm text-black dark:border-green-700 dark:bg-green-950/60 dark:text-white"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-green-900 dark:text-green-100">Cover letter</span>
                <textarea
                  className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm text-black placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-700 dark:bg-green-950/60 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  placeholder="Explain why you're a good fit for this job..."
                />
              </label>

              {applyError && (
                <p className="text-sm text-red-600 dark:text-red-400">{applyError}</p>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeApplyModal}
                  className="rounded-full border border-green-200 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-50 dark:border-green-700 dark:text-green-100 dark:hover:bg-green-950/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
