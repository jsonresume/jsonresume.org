import {
  Compass,
  Briefcase,
  Sparkles,
  BookOpen,
  Github,
  MessagesSquare,
  Route,
} from 'lucide-react';

/**
 * Public navigation links configuration
 */
export const NAV_LINKS = [
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
  },
  {
    href: '/jobs',
    label: 'Jobs',
    icon: Briefcase,
  },
  {
    href: '/pathways',
    label: 'Pathways',
    icon: Route,
  },
  {
    href: '/job-similarity',
    label: 'Similarity',
    icon: Sparkles,
  },
  {
    href: 'https://docs.jsonresume.org',
    label: 'Docs',
    icon: BookOpen,
    external: true,
  },
  {
    href: 'https://github.com/jsonresume/jsonresume.org',
    label: 'Github',
    icon: Github,
    external: true,
  },
  {
    href: 'https://discord.gg/GTZtn8pTXC',
    label: 'Discord',
    icon: MessagesSquare,
    external: true,
  },
];
