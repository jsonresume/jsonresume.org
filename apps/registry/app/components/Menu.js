'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Github } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Menu() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              JSON Resume Registry
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-gray-900">
              Explore
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/job-similarity" className="text-gray-600 hover:text-gray-900">
              Similarity
            </Link>
            <a
              href="https://github.com/jsonresume/jsonresume.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              Github
            </a>
            <a
              href="https://discord.gg/GTZtn8pTXC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              Discord
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={`/${user.user_metadata?.user_name || user.user_metadata?.preferred_username}/dashboard`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Settings
                </Link>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>
                  <Github className="w-4 h-4 mr-2" />
                  Sign in with GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
