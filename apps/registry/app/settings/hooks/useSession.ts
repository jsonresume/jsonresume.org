import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  return { session, loading };
};
