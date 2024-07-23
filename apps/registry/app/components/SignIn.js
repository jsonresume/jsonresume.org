import { Github } from 'lucide-react';
import { signIn } from '../../auth';
import { track } from '@vercel/analytics/server';
import { Button } from '@repo/ui/components/ui/button';
export default function SignIn() {
  return (
    <div className="text-lg m-8 w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6 text-gray-700">
        <p>
          Welcome to the JSON Resume Registry! Seamlessly sync your resume.json
          from GitHub Gist.
        </p>
        <p className="mt-4">
          If you already have a resume.json, it will be loaded directly into the
          editor for you.
        </p>
        <p className="mt-4">
          Rest assured, your data is secure. We do not store anything on our
          servers.
        </p>
      </div>
      <form
        action={async () => {
          'use server';
          track('Signin');
          await signIn('github');
        }}
      >
        <Button type="submit">
          <Github size={20} className="mr-2" /> Sign in with GitHub
        </Button>
      </form>
      <div className="mt-8 text-gray-500">
        <h3 className="text-gray-800 mb-3 text-xl">Upcoming Features</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Full-featured resume editor</li>
          <li className="line-through">Basic AI tools</li>
          <li>Social networking capabilities</li>
          <li>Opt-in notifications and analytics</li>
        </ul>
      </div>
    </div>
  );
}
