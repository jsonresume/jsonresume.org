import { Button } from '@repo/ui';
import { Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CreateResumeActions({ creating, onCreate }) {
  return (
    <div className="space-y-4">
      <Button
        onClick={onCreate}
        size="lg"
        className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
        disabled={creating}
      >
        <Github className="w-5 h-5" />
        {creating ? 'Creating Resume...' : 'Create Resume Gist'}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 text-gray-500">
              Need help getting started?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 text-lg h-14 hover:scale-105 transition-transform group"
          asChild
        >
          <Link href="/explore">
            Explore Other Resumes
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
