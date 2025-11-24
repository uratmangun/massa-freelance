import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const allJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error('Error fetching jobs', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const intervalNum = Number(intervalValue);
    if (!Number.isFinite(intervalNum) || intervalNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid interval value' },
        { status: 400 },
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

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error('Error creating job', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 },
    );
  }
}
