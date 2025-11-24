import { NextResponse } from 'next/server';
import { db } from '@/db';
import { applicants, jobs } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const jobId = Number(id);

  if (!Number.isFinite(jobId) || jobId <= 0) {
    return NextResponse.json(
      { error: 'Invalid job id' },
      { status: 400 },
    );
  }

  try {
    const rows = await db
      .select()
      .from(applicants)
      .where(eq(applicants.jobId, jobId))
      .orderBy(desc(applicants.appliedAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching applicants', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const jobId = Number(id);

  if (!Number.isFinite(jobId) || jobId <= 0) {
    return NextResponse.json(
      { error: 'Invalid job id' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { name, email, coverLetter, walletAddress } = body ?? {};

    if (!name || !email || !coverLetter || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Ensure job exists
    const [job] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
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

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error('Error creating applicant', error);
    return NextResponse.json(
      { error: 'Failed to create applicant' },
      { status: 500 },
    );
  }
}
