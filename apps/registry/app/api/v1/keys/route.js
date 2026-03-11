import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

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

  const key = `jr_${crypto.randomBytes(24).toString('hex')}`;

  const supabase = getSupabase();
  const { error } = await supabase.from('api_keys').insert({
    key,
    username: sanitized,
  });

  if (error) {
    return NextResponse.json(
      { error: `Failed to create key: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    key,
    username: sanitized,
    message: 'Save this key — it cannot be retrieved later.',
  });
}
