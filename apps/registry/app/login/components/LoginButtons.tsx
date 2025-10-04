'use client';

import { Button } from '@repo/ui';
import { Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const LoginButtons = ({
  onGithubLogin,
}: {
  onGithubLogin: () => void;
}) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onGithubLogin}
        size="lg"
        className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
      >
        <Github className="w-5 h-5" />
        Continue with GitHub
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-gray-500">
              New to JSON Resume?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
          asChild
        >
          <Link href="/">
            Learn More
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
