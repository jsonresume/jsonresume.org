'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Github, Menu as MenuIcon, X, FileJson } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
} from "@repo/ui/components/ui/card";

export default function Menu() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const NavLinks = () => (
    <>
      <Link href="/explore" className="text-sm font-medium text-gray-900 hover:text-gray-800">
        Explore
      </Link>
      <Link href="/jobs" className="text-sm font-medium text-gray-900 hover:text-gray-800">
        Jobs
      </Link>
      <Link href="/job-similarity" className="text-sm font-medium text-gray-900 hover:text-gray-800">
        Similarity
      </Link>
      <a
        href="https://github.com/jsonresume/jsonresume.org"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-900 hover:text-gray-800"
      >
        Github
      </a>
      <a
        href="https://discord.gg/GTZtn8pTXC"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-900 hover:text-gray-800"
      >
        Discord
      </a>
    </>
  );

  const AuthLinks = () => (
    <>
      {user ? (
        <>
          <Link
            href={`/${user.user_metadata?.user_name || user.user_metadata?.preferred_username}/dashboard`}
            className="text-sm font-medium text-gray-900 hover:text-gray-800"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-gray-900 hover:text-gray-800"
          >
            Settings
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-sm font-medium text-gray-900 hover:bg-gray-900/5"
          >
            Sign out
          </Button>
        </>
      ) : (
        <Link href="/login">
          <Button className="bg-gray-900 text-primary hover:bg-gray-800">
            <Github className="w-4 h-4 mr-2" />
            Sign in with GitHub
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <div className="bg-primary border-b border-gray-900/10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <FileJson className="w-6 h-6 text-gray-900" />
              <span className="text-lg font-bold text-gray-900">JSON Resume</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-900/5 md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-5 w-5" />
              ) : (
                <MenuIcon className="block h-5 w-5" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <NavLinks />
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <AuthLinks />
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <Card className="md:hidden mt-2 mb-4 bg-white/80 backdrop-blur-xl border-gray-900/10">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <NavLinks />
                </div>
                <div className="border-t border-gray-900/10 pt-4 flex flex-col gap-4">
                  <AuthLinks />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </nav>
    </div>
  );
}
