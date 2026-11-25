import { Avatar } from '@jsonresume/ui';
import { proxiedImage } from '@repo/images/url';
import { memo } from 'react';
import { creditHref, creditLabel, profileHref } from '../contributors';
import type { Contributor } from '../model';
import * as s from './contributors.css';

/** Credits shown before the rest fold into "and N more". */
const SHOWN = 6;

const avatarOf = (p: Contributor) =>
  p.id === undefined
    ? undefined
    : proxiedImage(`https://avatars.githubusercontent.com/u/${p.id}?v=4`, 96);

/** One person: who they are, linked, and every credit, each linked to the work. */
export const Person = memo(function Person({
  person,
}: {
  person: Contributor;
}) {
  const href = profileHref(person);
  const credits = person.credits.map((c) => (
    <li key={`${c.kind}|${c.where}`}>
      <a href={creditHref(c, person)}>{creditLabel(c)}</a>
    </li>
  ));
  const handle = person.github ?? person.npm;
  return (
    <li className={s.person}>
      <Avatar
        src={avatarOf(person)}
        name={person.name}
        size="md"
        shape="circle"
      />
      <div className={s.who}>
        <span className={s.name}>
          {href ? <a href={href}>{person.name}</a> : person.name}
        </span>
        {handle && handle !== person.name ? (
          <span className={s.handle}>
            {person.npm && !person.github ? `npm ~${handle}` : `@${handle}`}
          </span>
        ) : null}
        <ul className={s.credits} aria-label={`What ${person.name} did`}>
          {credits.slice(0, SHOWN)}
        </ul>
        {credits.length > SHOWN ? (
          <details className={s.more}>
            <summary>and {credits.length - SHOWN} more</summary>
            <ul className={s.credits}>{credits.slice(SHOWN)}</ul>
          </details>
        ) : null}
      </div>
    </li>
  );
});
