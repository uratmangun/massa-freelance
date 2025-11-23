import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return NextResponse.json(
      { error: 'Invalid job id' },
      { status: 400 },
    );
  }

  try {
    await db.delete(jobs).where(eq(jobs.id, idNum));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 },
    );
  }
}
