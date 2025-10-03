import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Github, FileJson, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 animate-pulse" />
        <CardContent className="relative pt-20 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/10 text-white/80 backdrop-blur-xl mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
              Join 10,000+ developers
            </span>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
              Ready to standardize your resume?
            </h2>
            <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Create a beautiful, standardized resume that you can version
              control, share, and maintain like code. Perfect for developers who
              take pride in their craft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform w-full sm:w-auto bg-white text-gray-900 hover:bg-white/90"
                asChild
              >
                <Link href="/login">
                  <Github className="w-5 h-5" />
                  Get Started with GitHub
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <span className="text-white/60">or</span>
              <Button
                size="lg"
                className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform w-full sm:w-auto bg-white text-gray-900 hover:bg-white/90"
                asChild
              >
                <a
                  href="https://jsonresume.org/schema"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileJson className="w-5 h-5" />
                  Explore the Schema
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
