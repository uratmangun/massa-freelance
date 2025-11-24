import JobApplicantsClient from './JobApplicantsClient';
import { db } from '@/db';
import { jobs } from '@/db/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const allJobs = await db.select({ id: jobs.id }).from(jobs);
    return allJobs.map((job) => ({ id: job.id.toString() }));
  } catch (error) {
    console.error('generateStaticParams failed for /hire/[id]/applicants:', error);
    return [];
  }
}

export default async function JobApplicantsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <JobApplicantsClient jobId={id} />;
}
