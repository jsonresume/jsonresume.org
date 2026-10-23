import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import {
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../interactive/interactive';
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

/* CodeTabs */

export interface CodeTab {
  /** Tab label, e.g. "npm". */
  label: string;
  code: string;
}

export interface CodeTabsProps {
  tabs: CodeTab[];
  /** Names the tab list, e.g. "Install with". */
  label: string;
  className?: string;
}

/** The same step written several ways (npm, pnpm, npx), one tab each. */
export function CodeTabs({ tabs, label, className }: CodeTabsProps) {
  const first = tabs[0]?.label;
  return (
    <Tabs defaultValue={first} className={cx(s.codeTabs, className)}>
      <TabsList aria-label={label}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <CodeBlock code={tab.code} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
