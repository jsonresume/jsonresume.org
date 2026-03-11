import { NextResponse } from 'next/server';
import { generateKey } from '../auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/keys — generate an API key for a username
 * Body: { "username": "thomasdavis" }
 *
 * Validates the username exists on the registry before creating.
 */
export async function POST(request) {
  const { username } = await request.json();

  if (!username || typeof username !== 'string') {
    return NextResponse.json(
      { error: 'username is required' },
      { status: 400 }
    );
  }

  const sanitized = username.toLowerCase().trim();

  // Verify the resume exists
  const res = await fetch(
    `https://registry.jsonresume.org/${sanitized}.json`
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: `No resume found for "${sanitized}" on registry.jsonresume.org` },
      { status: 404 }
    );
  }

  const key = generateKey(sanitized);

  return NextResponse.json({
    key,
    username: sanitized,
  });
}
