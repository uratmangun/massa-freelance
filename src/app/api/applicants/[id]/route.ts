import { NextResponse } from 'next/server';
import { db } from '@/db';
import { applicants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const applicantId = Number(id);

  if (!Number.isFinite(applicantId) || applicantId <= 0) {
    return NextResponse.json(
      { error: 'Invalid applicant id' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { status } = body ?? {};

    if (status !== 'pending' && status !== 'hired' && status !== 'rejected') {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(applicants)
      .set({ status })
      .where(eq(applicants.id, applicantId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating applicant status', error);
    return NextResponse.json(
      { error: 'Failed to update applicant status' },
      { status: 500 },
    );
  }
}
