'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAccountStore } from '@massalabs/react-ui-kit';
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
  amountMas: number;
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
            applicants.map((applicant) => (
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        applicant.status === 'hired'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                          : applicant.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                      }`}>
                        {applicant.status}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                      {applicant.email} • Wallet: {applicant.walletAddress.slice(0, 10)}...
                    </p>
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
                        <button
                          onClick={() => handleHire(applicant.id)}
                          disabled={hiringId === applicant.id || !connectedAccount}
                          className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-400"
                        >
                          {hiringId === applicant.id ? 'Hiring...' : 'Hire Freelancer'}
                        </button>
                        <button
                          onClick={() => handleReject(applicant.id)}
                          disabled={rejectingId === applicant.id || !connectedAccount}
                          className="px-6 py-2 text-sm font-medium text-green-600 border border-green-200 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
                        >
                          {rejectingId === applicant.id ? 'Rejecting...' : 'Reject'}
                        </button>
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
            ))
          )}
        </div>
      </main>
    </div>
  );
}
