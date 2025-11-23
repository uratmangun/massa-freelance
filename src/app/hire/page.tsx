'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccountStore } from '@massalabs/react-ui-kit';
import WalletConnect from '../components/WalletConnect';

export default function Hire() {
  const { connectedAccount } = useAccountStore();
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', pay: '0.5 MAS/minute', description: 'React expert needed.' },
    { id: 2, title: 'Backend Engineer', pay: '60 MAS/hour', description: 'Node.js and PostgreSQL.' },
  ]);

  const handleDelete = (id: number) => {
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connectedAccount) {
      alert('Please connect your wallet first.');
      return;
    }
    // Mock submission
    const formData = new FormData(e.currentTarget);
    const newJob = {
      id: Date.now(),
      title: formData.get('title') as string,
      pay: formData.get('pay') as string,
      description: formData.get('description') as string,
    };
    setJobs([...jobs, newJob]);
    (e.target as HTMLFormElement).reset();
  };

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
                className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-800 dark:bg-green-950 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                placeholder="e.g. Smart Contract Auditor"
              />
            </div>
            <div>
              <label htmlFor="pay" className="block text-sm font-medium text-green-900 dark:text-green-100">
                Pay Rate (in MAS)
              </label>
              <input
                type="text"
                id="pay"
                name="pay"
                required
                className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-800 dark:bg-green-950 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                placeholder="e.g. 50 MAS/hour"
              />
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
                className="mt-1 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm placeholder-green-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-green-800 dark:bg-green-950 dark:text-white dark:placeholder-green-700 dark:focus:border-green-400 dark:focus:ring-green-400"
                placeholder="Describe the job requirements..."
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-400"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>

        {/* Your Posted Jobs */}
        <h2 className="mb-6 text-2xl font-bold text-green-950 dark:text-green-50">Your Posted Jobs</h2>
        <div className="grid gap-6">
          {jobs.map((job) => (
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
                  className="rounded-full border border-green-200 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30"
                >
                  Remove
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
