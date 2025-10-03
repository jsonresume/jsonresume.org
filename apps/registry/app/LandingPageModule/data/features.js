import {
  Globe2,
  PaintBucket,
  Share2,
  Wand2,
  Github,
  FileJson,
} from 'lucide-react';

export const features = [
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
];
