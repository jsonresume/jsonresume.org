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
            v2.0 Beta
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            Your Resume as Code
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            JSON Resume Registry is the open-source platform that turns your
            GitHub Gist into a beautiful, standardized resume.{' '}
            <span className="font-semibold text-gray-800">Version control your career.</span>
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Button size="lg" className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform" asChild>
              <Link href="/login">
                <Github className="w-5 h-5" />
                Continue with GitHub
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform group" asChild>
              <a href="https://jsonresume.org/schema" target="_blank" rel="noopener noreferrer">
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
              description: 'Join the community-driven standard for resume data. Used by developers worldwide.',
              color: 'bg-blue-500/10',
            },
            {
              icon: <PaintBucket className="w-6 h-6 text-purple-500" />,
              title: 'Multiple Themes',
              description: 'Choose from a variety of professional themes or create your own using our theme API.',
              color: 'bg-purple-500/10',
            },
            {
              icon: <Share2 className="w-6 h-6 text-green-500" />,
              title: 'Instant Sharing',
              description: 'Share your resume with a simple URL. Perfect for job applications and social profiles.',
              color: 'bg-green-500/10',
            },
            {
              icon: <Wand2 className="w-6 h-6 text-amber-500" />,
              title: 'AI Powered',
              description: 'Get smart suggestions and improvements for your resume content using our AI tools.',
              color: 'bg-amber-500/10',
            },
            {
              icon: <Github className="w-6 h-6 text-gray-700" />,
              title: 'GitHub Integration',
              description: 'Store your resume in a GitHub Gist. Update it like you update your code.',
              color: 'bg-gray-500/10',
            },
            {
              icon: <FileJson className="w-6 h-6 text-red-500" />,
              title: 'JSON Schema',
              description: 'Follow our simple JSON schema to ensure your resume data is structured and portable.',
              color: 'bg-red-500/10',
            },
          ].map((feature, i) => (
            <Card key={i} className="group hover:shadow-lg transition-shadow duration-300 border-none">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
          <CardContent className="relative pt-16 pb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Ready to standardize your resume?
            </h2>
            <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
              Join thousands of developers who are using JSON Resume to create
              and share their professional profiles.
            </p>
            <Button size="lg" className="gap-2 text-lg h-14 px-8 hover:scale-105 transition-transform" asChild>
              <Link href="/login">
                <Github className="w-5 h-5" />
                Get Started with GitHub
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
