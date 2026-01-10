'use client';

import Link from 'next/link';
import { Github, LogOut, Home, Activity, Layers } from 'lucide-react';
import { Button } from '@repo/ui';
import { useAuth } from '@/app/context/auth';
import { supabase } from '@/app/lib/supabase';

export default function PathwaysHeader({ onOpenActivity }) {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const username =
    user?.user_metadata?.user_name || user?.user_metadata?.preferred_username;

  return (
    <header className="flex items-center justify-between px-4 h-12 border-b bg-white">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Back to Registry"
        >
          <Home className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Pathways</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/pathways/swipe" title="Swipe Mode">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Layers className="w-4 h-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenActivity}
          className="text-gray-500 hover:text-gray-700"
          title="View activity"
        >
          <Activity className="w-4 h-4" />
        </Button>

        {loading ? (
          <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
        ) : user ? (
          <>
            <Link
              href={`/${username}`}
              className="text-sm text-gray-600 hover:text-gray-900 px-2"
            >
              {username}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              <Github className="w-4 h-4 mr-2" />
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
