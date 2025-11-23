import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  // Mock data for jobs
  const jobs = [
    {
      id: 1,
      title: 'Smart Contract Auditor',
      company: 'DeFi Protocol X',
      pay: '50 MAS/hour',
      description: 'Audit our new staking contracts for vulnerabilities.',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'NFT Marketplace Y',
      pay: '0.5 MAS/minute',
      description: 'Build a responsive UI for our upcoming NFT launch.',
    },
    {
      id: 3,
      title: 'Community Manager',
      company: 'DAO Z',
      pay: '1000 MAS/month',
      description: 'Manage our Discord community and organize events.',
    },
    {
      id: 4,
      title: 'Rust Engineer',
      company: 'Massa Labs',
      pay: '60 MAS/hour',
      description: 'Contribute to the core protocol development.',
    },
    {
      id: 5,
      title: 'Technical Writer',
      company: 'Web3 Edu',
      pay: '0.1 MAS/minute',
      description: 'Write technical documentation and tutorials.',
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      {/* Header */}
      <header className="border-b border-green-200 bg-white px-6 py-4 dark:border-green-900 dark:bg-green-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-950 dark:text-green-50">
            Massa Freelance
          </Link>
          <button className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-400">
            Connect Wallet
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-green-950 dark:text-green-50">
          Available Jobs
        </h1>

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
                    {job.company}
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
        </div>
      </main>
    </div>
  );
}
