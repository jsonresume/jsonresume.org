import { Card, CardContent, Badge } from '@repo/ui';
import { FileJson } from 'lucide-react';
import { CreateResumeActions } from './CreateResumeActions';
import Link from 'next/link';

export function CreateResumeCard({ creating, onCreateResume }) {
  return (
    <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <Badge className="animate-pulse" variant="secondary">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
              Create Your Resume
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileJson className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              JSON Resume
            </h2>
          </div>
          <p className="text-gray-600 max-w-sm mx-auto">
            Get started with a pre-filled resume template. You can edit it
            anytime through{' '}
            <Link
              href="https://gist.github.com"
              className=" hover:text-primary/90 underline"
            >
              gist.github.com
            </Link>
            .
          </p>
        </div>

        <CreateResumeActions creating={creating} onCreate={onCreateResume} />
      </CardContent>
    </Card>
  );
}
