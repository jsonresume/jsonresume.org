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
 * Pointing at one (hover, focus, touch) fetches the page's code, so the
 * click finds it loaded. Only code: some loaders send the browser to the
 * server for their data, which a preload must not do.
 */
export const SiteLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(function SiteLink(
  {
    href,
    onClick,
    onMouseEnter,
    onFocus,
    onTouchStart,
    target,
    download,
    ...props
  },
  ref
) {
  const router = useRouter();
  const inApp = isSitePath(href) && !target && download === undefined;
  const preload = () => {
    if (!inApp) return;
    const [routes] = router.getMatchedRoutes(
      new URL(href, 'https://x').pathname
    );
    for (const route of routes)
      void router.loadRouteChunk(route)?.catch(() => undefined);
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      download={download}
      {...props}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        preload();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        preload();
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        preload();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!inApp || !isPlainClick(event)) return;
        event.preventDefault();
        void router.navigate({ href });
      }}
    />
  );
});
