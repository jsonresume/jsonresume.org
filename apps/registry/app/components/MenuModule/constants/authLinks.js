import { LayoutDashboard, Edit, Settings, Briefcase } from 'lucide-react';

/**
 * Authenticated user navigation links configuration
 * @param {string} username - User's GitHub username
 */
export const getAuthLinks = (username) => [
  {
    href: `/${username}/dashboard`,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/my-jobs',
    label: 'My Jobs',
    icon: Briefcase,
  },
  {
    href: '/editor',
    label: 'Editor',
    icon: Edit,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];
