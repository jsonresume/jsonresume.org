'use server';

import { auth } from '../auth';
import { redirect } from 'next/navigation';
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
} from 'lucide-react';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect(`/editor`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <Badge className="mb-4" variant="secondary">
          v2.0 Beta
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Your Resume as Code
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          JSON Resume Registry is the open-source platform that turns your
          GitHub Gist into a beautiful, standardized resume. Version control
          your career.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="gap-2">
            <Github className="w-4 h-4" />
            Continue with GitHub
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <FileJson className="w-4 h-4" />
            View Schema
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-500" />
                Open Source Standard
              </CardTitle>
              <CardDescription>
                Join the community-driven standard for resume data. Used by
                developers worldwide.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PaintBucket className="w-5 h-5 text-purple-500" />
                Multiple Themes
              </CardTitle>
              <CardDescription>
                Choose from a variety of professional themes or create your own
                using our theme API.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-500" />
                Instant Sharing
              </CardTitle>
              <CardDescription>
                Share your resume with a simple URL. Perfect for job
                applications and social profiles.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-500" />
                AI Powered
              </CardTitle>
              <CardDescription>
                Get smart suggestions and improvements for your resume content
                using our AI tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5 text-gray-700" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Store your resume in a GitHub Gist. Update it like you update
                your code.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-red-500" />
                JSON Schema
              </CardTitle>
              <CardDescription>
                Follow our simple JSON schema to ensure your resume data is
                structured and portable.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Card className="bg-gray-900 text-white">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to standardize your resume?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are using JSON Resume to create
              and share their professional profiles.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              <Github className="w-4 h-4" />
              Sign in with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
