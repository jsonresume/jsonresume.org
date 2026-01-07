import { Github, Linkedin, Twitter, Globe } from 'lucide-react';

export const getProfileIcon = (network) => {
  const icons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
  };
  const Icon = icons[network?.toLowerCase()] || Globe;
  return <Icon className="w-4 h-4" />;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

export const getSkillLevelPercent = (level) => {
  const levels = {
    Master: 100,
    Expert: 90,
    Advanced: 75,
    Intermediate: 50,
    Beginner: 25,
  };
  return levels[level] || 25;
};
