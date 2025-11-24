import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    {
      error:
        "This endpoint is disabled. Contract deployment is now handled entirely from the frontend using the connected wallet.",
    },
    { status: 410 }
  );
}
