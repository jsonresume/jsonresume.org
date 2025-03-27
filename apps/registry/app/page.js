'use server';

import { auth } from '../auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import {
  Github,
  FileJson,
  Wand2,
  Globe2,
  Share2,
  PaintBucket,
  ArrowRight,
  Code2,
  Users,
} from 'lucide-react';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect(`/editor`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
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

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe2 className="w-6 h-6 text-blue-500" />,
              title: 'Open Source Standard',
              description:
                'Join the community-driven standard for resume data. Used by developers worldwide.',
              color: 'bg-blue-500/10',
            },
            {
              icon: <PaintBucket className="w-6 h-6 text-purple-500" />,
              title: 'Multiple Themes',
              description:
                'Choose from a variety of professional themes or create your own using our theme API.',
              color: 'bg-purple-500/10',
            },
            {
              icon: <Share2 className="w-6 h-6 text-green-500" />,
              title: 'Instant Sharing',
              description:
                'Share your resume with a simple URL. Perfect for job applications and social profiles.',
              color: 'bg-green-500/10',
            },
            {
              icon: <Wand2 className="w-6 h-6 text-amber-500" />,
              title: 'AI Powered',
              description:
                'Get smart suggestions and improvements for your resume content using our AI tools.',
              color: 'bg-amber-500/10',
            },
            {
              icon: <Github className="w-6 h-6 text-gray-700" />,
              title: 'GitHub Integration',
              description:
                'Store your resume in a GitHub Gist. Update it like you update your code.',
              color: 'bg-gray-500/10',
            },
            {
              icon: <FileJson className="w-6 h-6 text-red-500" />,
              title: 'JSON Schema',
              description:
                'Follow our simple JSON schema to ensure your resume data is structured and portable.',
              color: 'bg-red-500/10',
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="group hover:shadow-lg transition-shadow duration-300 border-none"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
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
                control, share, and maintain like code. Perfect for developers
                who take pride in their craft.
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <FileJson className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">JSON Resume</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                An open-source initiative to create a JSON-based standard for
                resumes. Helping developers showcase their work and experience.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/jsonresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/jsonresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/jsonresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://jsonresume.org/schema"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Schema
                  </a>
                </li>
                <li>
                  <a
                    href="https://jsonresume.org/themes"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Themes
                  </a>
                </li>
                <li>
                  <a
                    href="https://jsonresume.org/getting-started"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="https://jsonresume.org/api"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/jsonresume"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/jsonresume"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/jsonresume"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://jsonresume.org/blog"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} JSON Resume. Open source under
                MIT license.
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
