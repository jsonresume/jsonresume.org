import type { ReactNode } from 'react';
import * as s from './home.css';

export function SectionIntro({
  id,
  overline,
  title,
  children,
  centered = false,
}: {
  id: string;
  overline: string;
  title: ReactNode;
  children?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={centered ? s.introCentered : s.intro}>
      <p className={s.overline}>{overline}</p>
      <h2 id={id} className={s.title}>
        {title}
      </h2>
      {children ? <p className={s.lede}>{children}</p> : null}
    </div>
  );
}
