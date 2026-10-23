import { SiteFooter } from '@jsonresume/ui';

export default function SiteFooterDefault() {
  return (
    <SiteFooter
      note="JSON Resume is open source"
      links={[
        <a key="gh" href="https://github.com/jsonresume">
          View on GitHub
        </a>,
        <a key="ai" href="https://jsonresume.org/ai">
          AI
        </a>,
        <a key="blog" href="https://jsonresume.org/blog">
          Blog
        </a>,
        <a key="media" href="https://jsonresume.org/media">
          Media
        </a>,
      ]}
    />
  );
}
