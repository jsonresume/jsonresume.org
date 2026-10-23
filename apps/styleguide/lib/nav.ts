import { componentDocs, componentGroups } from './components';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

export const foundations: NavLink[] = [
  { href: '/foundations/color', label: 'Color' },
  { href: '/foundations/typography', label: 'Typography' },
  { href: '/foundations/spacing', label: 'Spacing' },
  { href: '/foundations/shape', label: 'Radius and elevation' },
  { href: '/foundations/motion', label: 'Motion' },
  { href: '/foundations/layout', label: 'Layout' },
  { href: '/foundations/iconography', label: 'Iconography' },
];

export const navGroups: NavGroup[] = [
  {
    label: 'Start',
    links: [
      { href: '/', label: 'Overview' },
      { href: '/brand', label: 'Brand' },
      { href: '/getting-started', label: 'Getting started' },
    ],
  },
  { label: 'Foundations', links: foundations },
  ...componentGroups.map((group) => ({
    label: group,
    links: componentDocs
      .filter((d) => d.group === group)
      .map((d) => ({ href: `/components/${d.slug}`, label: d.name })),
  })),
  {
    label: 'Guides',
    links: [
      { href: '/patterns', label: 'Patterns' },
      { href: '/writing', label: 'Writing' },
      { href: '/accessibility', label: 'Accessibility' },
      { href: '/tokens', label: 'Token reference' },
      { href: '/resources', label: 'Resources' },
      { href: '/contributing', label: 'Contributing' },
    ],
  },
];

export const headerLinks: NavLink[] = [
  { href: '/brand', label: 'Brand' },
  { href: '/foundations/color', label: 'Foundations' },
  { href: '/components/button', label: 'Components' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/tokens', label: 'Tokens' },
];
