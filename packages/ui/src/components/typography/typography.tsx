import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { cx } from '../../utils/cx';
import {
  code,
  externalIcon,
  heading,
  kbd,
  link,
  prose,
  text,
  type HeadingVariants,
  type LinkVariants,
  type TextVariants,
} from './typography.css';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    HeadingVariants {
  /** Document outline level. Choose it for structure; choose `size` for looks. */
  level?: HeadingLevel;
}

const defaultSize: Record<
  HeadingLevel,
  NonNullable<HeadingVariants['size']>
> = {
  1: 'title',
  2: 'section',
  3: 'subsection',
  4: 'group',
  5: 'label',
  6: 'label',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, size, className, ...props }, ref) {
    const Tag = `h${level}` as const;
    return (
      <Tag
        ref={ref}
        className={cx(heading({ size: size ?? defaultSize[level] }), className)}
        {...props}
      />
    );
  }
);

export interface TextProps extends HTMLAttributes<HTMLElement>, TextVariants {
  as?: 'p' | 'span' | 'div' | 'small' | 'strong' | 'em' | 'label';
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = 'p', size, tone, weight, caps, measure, className, ...props },
  ref
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cx(text({ size, tone, weight, caps, measure }), className)}
      {...props}
    />
  );
});

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    LinkVariants {
  /** Style a router link (e.g. Next.js `Link`) passed as the only child. */
  asChild?: boolean;
  /** Marks the link as leaving the site: opens a new tab and adds an icon. */
  external?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { asChild = false, external = false, tone, className, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'a';
  const externalProps = external
    ? { target: '_blank', rel: 'noreferrer noopener' }
    : {};
  return (
    <Comp
      ref={ref}
      className={cx(link({ tone }), className)}
      {...externalProps}
      {...props}
    >
      {children}
      {external && !asChild ? (
        <>
          <svg
            className={externalIcon}
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4.5 2.5h5v5M9.5 2.5 3 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <span className={visuallyHidden}>(opens in a new tab)</span>
        </>
      ) : null}
    </Comp>
  );
});

export const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Code({ className, ...props }, ref) {
    return <code ref={ref} className={cx(code, className)} {...props} />;
  }
);

export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Kbd({ className, ...props }, ref) {
    return <kbd ref={ref} className={cx(kbd, className)} {...props} />;
  }
);

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as the child element (e.g. <article>) instead of a <div>. */
  asChild?: boolean;
}

/** Styles rendered Markdown or other long-form HTML. */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { asChild = false, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'div';
  return <Comp ref={ref} className={cx(prose, className)} {...props} />;
});
