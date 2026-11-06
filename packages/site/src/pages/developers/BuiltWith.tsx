import { Badge, CodeTabs, LinkCard, SectionIntro } from '@jsonresume/ui';
import { builtWith as b } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import * as l from '../shared/layout.css';
import * as s from './BuiltWith.css';

/** Apps already signing people in with JSON Resume. */
export function BuiltWithApps() {
  return (
    <section id="apps" aria-labelledby="apps-title">
      <SectionIntro
        overline="In the wild"
        title="Built with JSON Resume"
        headingId="apps-title"
      >
        <InlineMarkdown>{b.appsIntro}</InlineMarkdown>
      </SectionIntro>
      <ul className={l.cardGrid} aria-label="Apps">
        {b.apps.map((app) => (
          <li key={app.name}>
            <LinkCard
              href={app.href}
              eyebrow={`By ${app.by}`}
              title={app.name}
              description={app.description}
              meta={<Badge tone="neutral">{app.scopes}</Badge>}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The "Works with JSON Resume" badge and how to use it. */
export function WorksWithBadge() {
  return (
    <section id="badge" aria-labelledby="badge-title">
      <SectionIntro
        overline="Badge"
        title="Works with JSON Resume"
        headingId="badge-title"
      >
        {b.badge.intro}
      </SectionIntro>
      <div className={s.previews}>
        <div className={s.light}>
          <img
            src="/badges/works-with-jsonresume.svg"
            alt="Works with JSON Resume"
            width={218}
            height={36}
          />
        </div>
        <div className={s.dark}>
          <img
            src="/badges/works-with-jsonresume-dark.svg"
            alt="Works with JSON Resume, for dark backgrounds"
            width={218}
            height={36}
          />
        </div>
      </div>
      <CodeTabs label="Badge code" tabs={b.badgeSnippets} />
    </section>
  );
}
