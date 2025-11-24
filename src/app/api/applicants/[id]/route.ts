import { NextResponse } from 'next/server';
import { db } from '@/db';
import { applicants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { enforceAllowedOrigin, handleCorsPreflight, withCors } from '@/app/api/cors';

export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  const { id } = await context.params;
  const applicantId = Number(id);

  if (!Number.isFinite(applicantId) || applicantId <= 0) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid applicant id' },
        { status: 400 },
      ),
      originCheck.origin,
    );
  }

  try {
    const body = await request.json();
    const { status } = body ?? {};

    if (status !== 'pending' && status !== 'hired' && status !== 'rejected') {
      return withCors(
        NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 },
        ),
        originCheck.origin,
      );
    }

    const [updated] = await db
      .update(applicants)
      .set({ status })
      .where(eq(applicants.id, applicantId))
      .returning();

    if (!updated) {
      return withCors(
        NextResponse.json(
          { error: 'Applicant not found' },
          { status: 404 },
        ),
        originCheck.origin,
      );
    }

    return withCors(NextResponse.json(updated), originCheck.origin);
  } catch (error) {
    console.error('Error updating applicant status', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to update applicant status' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}
