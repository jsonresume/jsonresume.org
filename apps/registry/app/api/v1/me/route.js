import { NextResponse } from 'next/server';
import { authenticate } from '../auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/me — returns the authenticated user's resume
 */
export async function GET(request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(
    `https://registry.jsonresume.org/${user.username}.json`
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: `Resume not found for ${user.username}` },
      { status: 404 }
    );
  }

  const resume = await res.json();
  return NextResponse.json({ username: user.username, resume });
}
