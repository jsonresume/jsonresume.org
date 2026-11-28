'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './interactive.css';

/* Accordion */

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cx(s.accordionItem, className)}
      {...props}
    />
  );
});

const headings = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

/** An item's header: a heading (h3 unless `level` says) holding the toggle. */
export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    /** The heading level, to fit the page's outline. Default 3. */
    level?: keyof typeof headings;
  }
>(function AccordionTrigger({ className, children, level = 3, ...props }, ref) {
  const Heading = headings[level];
  return (
    <AccordionPrimitive.Header className={s.accordionHeader} asChild>
      <Heading>
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cx(s.accordionTrigger, className)}
          {...props}
        >
          {children}
          <svg
            className={s.accordionChevron}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="m4 6 4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cx(s.accordionContent, className)}
      {...props}
    >
      <div className={s.accordionContentInner}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
