import { NextResponse } from "next/server";
import { enforceAllowedOrigin, handleCorsPreflight, withCors } from "@/app/api/cors";

export function OPTIONS(request: Request) {
  return handleCorsPreflight(request);
}

export function POST(request: Request) {
  const originCheck = enforceAllowedOrigin(request);
  if (!originCheck.ok) {
    return originCheck.response;
  }

  return withCors(
    NextResponse.json(
      {
        error:
          "This endpoint is disabled. Contract deployment is now handled entirely from the frontend using the connected wallet.",
      },
      { status: 410 },
    ),
    originCheck.origin,
  );
}
