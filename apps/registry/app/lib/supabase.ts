import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  'https://itxuhvvwryeuzuyihpkp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHVodnZ3cnlldXp1eWlocGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5OTA4NjQsImV4cCI6MjAyMzU2Njg2NH0.oEs0H2aumAHsiLn6i9ic1-iwWDo3bJkFkC7NCeUrIfA'
);
