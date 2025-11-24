import JobApplicantsClient from './JobApplicantsClient';
import { apiFetch } from '../../../lib/api';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const originHeader =
      process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'deweb'
        ? 'https://massa-freelance.build.half-red.net'
        : 'http://localhost:3000';

    const response = await apiFetch('/api/jobs', {
      headers: {
        origin: originHeader,
      },
    });

    if (!response.ok) {
      console.error(
        'generateStaticParams failed for /hire/[id]/applicants: API returned status',
        response.status,
      );
      return [];
    }

    const allJobs: Array<{ id: number | string }> = await response.json();
    return allJobs
      .filter((job) => job && job.id !== undefined && job.id !== null)
      .map((job) => ({ id: String(job.id) }));
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
