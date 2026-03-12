import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticate } from '../../auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

/**
 * PUT /api/v1/searches/:id — update filters for a search profile
 *
 * Body: { filters: [...] }
 */
export async function PUT(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const supabase = getSupabase();

  // Verify ownership
  const { data: existing } = await supabase
    .from('search_profiles')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.username) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updates = { updated_at: new Date().toISOString() };
  if (body.filters !== undefined) updates.filters = body.filters;
  if (body.name !== undefined) updates.name = body.name;

  const { data, error } = await supabase
    .from('search_profiles')
    .update(updates)
    .eq('id', id)
    .select('id, name, prompt, filters, created_at, updated_at')
    .single();

  if (error) {
    logger.error({ error: error.message }, 'Error updating search profile');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ search: data });
}

/**
 * DELETE /api/v1/searches/:id — delete a search profile
 */
export async function DELETE(request, { params }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabase();

  // Verify ownership
  const { data: existing } = await supabase
    .from('search_profiles')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.username) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error } = await supabase
    .from('search_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error({ error: error.message }, 'Error deleting search profile');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
