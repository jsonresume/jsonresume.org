import Link from 'next/link';
import { Button, Badge } from '@repo/ui';
import { Github, FileJson, ArrowRight, Code2, Users } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <Badge className="mb-4 animate-pulse" variant="secondary">
          v1.0 Beta
        </Badge>
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          Your Resume as Code
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          JSON Resume Registry is the open-source platform that turns your
          GitHub Gist into a beautiful, standardized resume.{' '}
          <span className="font-semibold text-gray-800">
            Version control your career.
          </span>
        </p>
        <div className="flex gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform"
            asChild
          >
            <Link href="/login">
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform group"
            asChild
          >
            <a
              href="https://jsonresume.org/schema"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileJson className="w-5 h-5" />
              View Schema
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
        <div className="flex justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>10,000+ Developers</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </div>
  );
};
