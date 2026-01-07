import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (req.method === 'GET') {
    // Load preferences
    const { data, error } = await supabase
      .from('pathways_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (not an error for us)
      console.error('Error loading preferences:', error);
      return res.status(500).json({ error: 'Failed to load preferences' });
    }

    // Return defaults if no preferences found
    if (!data) {
      return res.status(200).json({
        filterText: '',
        showSalaryGradient: false,
        remoteOnly: false,
        hideFiltered: false,
        timeRange: '1m',
        viewport: { x: 0, y: 0, zoom: 1 },
      });
    }

    return res.status(200).json({
      filterText: data.filter_text || '',
      showSalaryGradient: data.show_salary_gradient || false,
      remoteOnly: data.remote_only || false,
      hideFiltered: data.hide_filtered || false,
      timeRange: data.time_range || '1m',
      viewport: {
        x: data.viewport_x || 0,
        y: data.viewport_y || 0,
        zoom: data.viewport_zoom || 1,
      },
    });
  }

  if (req.method === 'POST') {
    // Save preferences
    const {
      filterText,
      showSalaryGradient,
      remoteOnly,
      hideFiltered,
      timeRange,
      viewport,
    } = req.body;

    const { error } = await supabase.from('pathways_preferences').upsert(
      {
        user_id: userId,
        filter_text: filterText || '',
        show_salary_gradient: showSalaryGradient || false,
        remote_only: remoteOnly || false,
        hide_filtered: hideFiltered || false,
        time_range: timeRange || '1m',
        viewport_x: viewport?.x || 0,
        viewport_y: viewport?.y || 0,
        viewport_zoom: viewport?.zoom || 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Error saving preferences:', error);
      return res.status(500).json({ error: 'Failed to save preferences' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
