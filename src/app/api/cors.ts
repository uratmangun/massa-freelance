import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set<string>([
  'https://massa-freelance.build.half-red.net',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

export function getRequestOrigin(request: Request): string | null {
  return request.headers.get('origin');
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin);
}

export function withCors<T>(
  response: NextResponse<T>,
  origin: string | null,
): NextResponse<T> {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  return response;
}

export function handleCorsPreflight(request: Request): NextResponse {
  const origin = getRequestOrigin(request);

  if (!isAllowedOrigin(origin)) {
    return withCors(
      NextResponse.json(
        { error: 'Origin not allowed' },
        { status: 403 },
      ),
      origin,
    );
  }

  return withCors(NextResponse.json(null, { status: 204 }), origin);
}

export function enforceAllowedOrigin(
  request: Request,
): { ok: true; origin: string } | { ok: false; response: NextResponse } {
  const origin = getRequestOrigin(request);
  if (!isAllowedOrigin(origin)) {
    return {
      ok: false,
      response: withCors(
        NextResponse.json(
          { error: 'Origin not allowed' },
          { status: 403 },
        ),
        origin,
      ),
    };
  }

  return { ok: true, origin: origin! };
}
