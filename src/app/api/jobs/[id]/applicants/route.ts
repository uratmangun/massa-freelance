import { NextResponse } from 'next/server';
import { db } from '@/db';
import { applicants, jobs } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { enforceAllowedOrigin, handleCorsPreflight, withCors } from '@/app/api/cors';

export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  const { id } = await context.params;
  const jobId = Number(id);

  if (!Number.isFinite(jobId) || jobId <= 0) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid job id' },
        { status: 400 },
      ),
      originCheck.origin,
    );
  }

  try {
    const rows = await db
      .select()
      .from(applicants)
      .where(eq(applicants.jobId, jobId))
      .orderBy(desc(applicants.appliedAt));

    return withCors(NextResponse.json(rows), originCheck.origin);
  } catch (error) {
    console.error('Error fetching applicants', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to fetch applicants' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  const { id } = await context.params;
  const jobId = Number(id);

  if (!Number.isFinite(jobId) || jobId <= 0) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid job id' },
        { status: 400 },
      ),
      originCheck.origin,
    );
  }

  try {
    const body = await request.json();
    const { name, email, coverLetter, walletAddress } = body ?? {};

    if (!name || !email || !coverLetter || !walletAddress) {
      return withCors(
        NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 },
        ),
        originCheck.origin,
      );
    }

    // Ensure job exists
    const [job] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return withCors(
        NextResponse.json(
          { error: 'Job not found' },
          { status: 404 },
        ),
        originCheck.origin,
      );
    }

    const [inserted] = await db
      .insert(applicants)
      .values({
        jobId,
        name,
        email,
        coverLetter,
        walletAddress,
        status: 'pending',
      })
      .returning();

    return withCors(
      NextResponse.json(inserted, { status: 201 }),
      originCheck.origin,
    );
  } catch (error) {
    console.error('Error creating applicant', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to create applicant' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}
