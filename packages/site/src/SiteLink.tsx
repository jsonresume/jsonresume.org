import { useRouter } from '@tanstack/react-router';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/** A path on this site: '/schema', '/blog/x#y', not '//cdn' or 'https://'. */
export const isSitePath = (href: string) => /^\/(?!\/)/.test(href);

const isPlainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !event.defaultPrevented &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

/**
 * An <a> that navigates in-app for same-site paths and behaves normally
 * otherwise (external links, new tabs, downloads). Works with any string, so
 * content and shared packages need no knowledge of the app's route types.
 */
export const SiteLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(function SiteLink({ href, onClick, target, download, ...props }, ref) {
  const router = useRouter();
  const inApp = isSitePath(href) && !target && download === undefined;

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      download={download}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!inApp || !isPlainClick(event)) return;
        event.preventDefault();
        void router.navigate({ href });
      }}
    />
  );
});
