import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './content.css';

/* SectionIntro */

export interface SectionIntroProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Small uppercase label above the title. */
  overline?: ReactNode;
  /** Heading level. Defaults to 2. */
  level?: 2 | 3;
  /** id for the heading, to link to it or label a section with it. */
  headingId?: string;
  align?: 'start' | 'center';
}

/** The opening of a page section: overline, light title, one-line lede. */
export function SectionIntro({
  title,
  overline,
  level = 2,
  headingId,
  align = 'start',
  className,
  children,
  ...props
}: SectionIntroProps) {
  const Heading = `h${level}` as const;
  return (
    <div
      className={cx(s.intro, align === 'center' && s.introCenter, className)}
      {...props}
    >
      {overline ? <p className={s.overline}>{overline}</p> : null}
      <Heading id={headingId} className={s.introTitle}>
        {title}
      </Heading>
      {children ? <p className={s.introLede}>{children}</p> : null}
    </div>
  );
}

/* LinkCard */

export interface LinkCardProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Small uppercase label above the title, e.g. a category. */
  eyebrow?: ReactNode;
  /** Badges or other details under the description. */
  meta?: ReactNode;
  /** Pass your own link element (e.g. a router link) as the only child. */
  asChild?: boolean;
}

/** A whole-card link: title with an arrow, description, optional details. */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  function LinkCard(
    {
      title,
      description,
      eyebrow,
      meta,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp ref={ref} className={cx(s.linkCard, className)} {...props}>
        {eyebrow ? <span className={s.linkCardEyebrow}>{eyebrow}</span> : null}
        <span className={s.linkCardTitle}>
          {title}
          <span className={s.linkCardArrow} aria-hidden="true">
            →
          </span>
        </span>
        {description ? (
          <span className={s.linkCardText}>{description}</span>
        ) : null}
        {meta ? <span className={s.linkCardMeta}>{meta}</span> : null}
        {asChild ? <Slottable>{children}</Slottable> : null}
      </Comp>
    );
  }
);
