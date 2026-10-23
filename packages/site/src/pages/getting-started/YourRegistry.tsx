import { gettingStarted as g } from '@repo/content/pages';
import { GithubUserField, useGithubUser } from '../../githubUser';
import * as l from '../shared/layout.css';

const HOST = 'https://registry.jsonresume.org/';

/** A registry link, shown without the shared host so it reads at a glance. */
function RegistryLink({ href }: { href: string }) {
  return (
    <a className={l.url} href={href}>
      {href.replace(HOST, '')}
    </a>
  );
}

/** The reader's registry address and formats, built from their username. */
export function YourRegistry() {
  const user = useGithubUser();
  const rows = [
    {
      label: 'Resume',
      href: g.registryUrl(user),
      title: 'Your resume, in your theme.',
    },
    {
      label: 'Any theme',
      href: g.themedUrl(user, 'elegant'),
      title: 'Try a theme without editing.',
    },
    ...g.rawFormats.map((f) => ({
      label: f.label,
      href: f.path(user),
      title: f.description,
    })),
  ];
  return (
    <aside className={l.panel} aria-labelledby="your-registry">
      <h3 id="your-registry" className={l.panelTitle}>
        Your registry address
      </h3>
      <GithubUserField />
      <p className={l.muted}>
        Everything lives under <span className={l.url}>{HOST}</span>
      </p>
      <ul className={l.linkList}>
        {rows.map((row) => (
          <li key={row.label} className={l.linkRow} title={row.title}>
            <span className={l.linkRowLabel}>{row.label}</span>
            <RegistryLink href={row.href} />
          </li>
        ))}
      </ul>
      <p className={l.muted}>
        More versions? Add files such as resume-fr.json to the same Gist and
        open <RegistryLink href={g.gistFileUrl(user, 'resume-fr.json')} />.
        Prefer your own repository? A{' '}
        <a href={g.ownRepoExample}>GitHub Action can publish the Gist</a> on
        every push.
      </p>
    </aside>
  );
}
