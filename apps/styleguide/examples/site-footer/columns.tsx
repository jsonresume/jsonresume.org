import { Logo, SiteFooter } from '@jsonresume/ui';

const link = (label: string) => (
  <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}>
    {label}
  </a>
);

export default function SiteFooterColumns() {
  return (
    <SiteFooter
      brand={<Logo mark href="#home" />}
      note="The open standard for resumes, built by volunteers since 2014."
      groups={[
        {
          title: 'Resume',
          links: ['Getting started', 'Schema', 'Themes'].map(link),
        },
        { title: 'Build', links: ['CLI', 'Theme development'].map(link) },
        { title: 'Project', links: ['Blog', 'Team', 'GitHub'].map(link) },
      ]}
      legal={['Privacy', 'Terms'].map(link)}
    />
  );
}
