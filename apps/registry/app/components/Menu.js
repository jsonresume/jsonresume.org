'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  Github,
  Menu as MenuIcon,
  X,
  FileJson,
  Compass,
  Briefcase,
  Sparkles,
  MessagesSquare,
  Settings as SettingsIcon,
  LogOut,
  LayoutDashboard,
  Edit,
  Atom,
  Crown,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Card, CardContent } from '@repo/ui';

export default function Menu() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hide menu on Pathways page
  if (pathname?.startsWith('/pathways')) {
    return null;
  }

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

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
      <Link
        href="/explore"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        Explore
      </Link>
      <Link
        href="/jobs"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Briefcase className="w-4 h-4" />
        Jobs
      </Link>
      <Link
        href="/job-similarity"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Similarity
      </Link>
      <Link
        href="/cosmic-jobs"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Atom className="w-4 h-4" />
        Cosmic Jobs
      </Link>
      <Link
        href="/resume-chess"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Crown className="w-4 h-4" />
        Resume Chess
      </Link>
      <a
        href="https://github.com/jsonresume/jsonresume.org"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <Github className="w-4 h-4" />
        Github
      </a>
      <a
        href="https://discord.gg/GTZtn8pTXC"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
      >
        <MessagesSquare className="w-4 h-4" />
        Discord
      </a>
    </>
  );

  const AuthLinks = () => (
    <>
      {user ? (
        <>
          <Link
            href={`/${
              user.user_metadata?.user_name ||
              user.user_metadata?.preferred_username
            }/dashboard`}
            className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/editor"
            className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editor
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-white hover:text-gray-200 flex items-center gap-2"
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
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
    <div className="bg-blue-600 border-b border-gray-900/10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <FileJson className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">JSON Resume</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <NavLinks />
          </div>

          {/* Desktop Auth Links and Mobile Menu Button */}
          <div className="flex items-center gap-6 justify-end">
            <div className="hidden md:flex md:items-center md:gap-6">
              <AuthLinks />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-5 w-5" />
              ) : (
                <MenuIcon className="block h-5 w-5" />
              )}
            </button>
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
