import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHVodnZ3cnlldXp1eWlocGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5OTA4NjQsImV4cCI6MjAyMzU2Njg2NH0.oEs0H2aumAHsiLn6i9ic1-iwWDo3bJkFkC7NCeUrIfA';

const supabase = createClient(supabaseUrl, supabaseKey);

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const subscription = supabase
      .channel('room1')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'views' },
        (payload) => {
          setCount((prevCount) => prevCount + 1);
        }
      )
      .subscribe();

    // Fetch initial count
    const fetchInitialCount = async () => {
      const { data, error } = await supabase
        .from('views')
        .select('*', { count: 'exact' });
      if (!error) {
        setCount(data.length);
      }
    };

    fetchInitialCount();

    //unsubscribe
  }, []);

  return (
    <div>
      <h1>Real-time Counter</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default Counter;
