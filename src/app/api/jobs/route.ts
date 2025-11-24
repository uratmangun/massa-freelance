import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { enforceAllowedOrigin, handleCorsPreflight, withCors } from '@/app/api/cors';

export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export async function GET(request: Request) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  try {
    const allJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt));

    return withCors(NextResponse.json(allJobs), originCheck.origin);
  } catch (error) {
    console.error('Error fetching jobs', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}

export async function POST(request: Request) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      amount,
      intervalValue,
      intervalUnit,
      walletAddress,
      contractAddress,
    } = body ?? {};

    if (!title || !description || !amount || !intervalValue || !intervalUnit || !walletAddress || !contractAddress) {
      return withCors(
        NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 },
        ),
        originCheck.origin,
      );
    }

    const intervalNum = Number(intervalValue);
    if (!Number.isFinite(intervalNum) || intervalNum <= 0) {
      return withCors(
        NextResponse.json(
          { error: 'Invalid interval value' },
          { status: 400 },
        ),
        originCheck.origin,
      );
    }

    const amountStr = String(amount);
    const baseUnit = intervalNum === 1 ? intervalUnit : `${intervalUnit}s`;
    const pay = `${amountStr} MAS / ${intervalNum} ${baseUnit}`;

    const [inserted] = await db
      .insert(jobs)
      .values({
        title,
        pay,
        amountMas: amountStr,
        intervalValue: intervalNum,
        intervalUnit,
        description,
        walletAddress,
        contractAddress,
      })
      .returning();

    return withCors(
      NextResponse.json(inserted, { status: 201 }),
      originCheck.origin,
    );
  } catch (error) {
    console.error('Error creating job', error);
    return withCors(
      NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 },
      ),
      originCheck.origin,
    );
  }
}
