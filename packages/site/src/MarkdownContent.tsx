import { Markdown } from '@jsonresume/ui';
import { facts } from '@repo/content/facts';
import { fillFacts } from '@repo/content/placeholders';
import { isSitePath, SiteLink } from './SiteLink';

/** Site Markdown: facts filled in, same-site links navigate in-app. */
export function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      renderLink={({ href, children: label }) =>
        isSitePath(href) ? <SiteLink href={href}>{label}</SiteLink> : undefined
      }
    >
      {fillFacts(children, facts)}
    </Markdown>
  );
}
