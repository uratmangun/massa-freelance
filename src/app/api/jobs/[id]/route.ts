import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  const idNum = Number(id);

  if (!Number.isFinite(idNum) || idNum <= 0) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid job id' },
        { status: 400 },
      ),
      originCheck.origin,
    );
  }

  try {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, idNum))
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

    return withCors(NextResponse.json(job), originCheck.origin);
  } catch (error) {
    console.error('Error fetching job', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to fetch job' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  const { id } = await context.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid job id' },
        { status: 400 },
      ),
      originCheck.origin,
    );
  }

  try {
    await db.delete(jobs).where(eq(jobs.id, idNum));
    return withCors(NextResponse.json({ success: true }), originCheck.origin);
  } catch (error) {
    console.error('Error deleting job', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to delete job' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}
