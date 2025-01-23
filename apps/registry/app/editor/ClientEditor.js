'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth';
import Editor from '../components/Editor';

export default function ClientEditor() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-lg text-center py-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-lg text-center py-10">Redirecting to login...</div>
    );
  }

  return <Editor />;
}
