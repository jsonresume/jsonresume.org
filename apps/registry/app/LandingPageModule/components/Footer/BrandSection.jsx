import { FileJson, Github } from 'lucide-react';
import { TwitterIcon, DiscordIcon } from './icons';

export const BrandSection = () => {
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <FileJson className="w-6 h-6 text-primary" />
        <span className="font-bold text-xl">JSON Resume</span>
      </div>
      <p className="text-gray-600 mb-4 max-w-md">
        An open source initiative to create a JSON-based standard for resumes.
        Helping developers showcase their work and experience.
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
          <TwitterIcon />
        </a>
        <a
          href="https://discord.gg/jsonresume"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <DiscordIcon />
        </a>
      </div>
    </div>
  );
};
