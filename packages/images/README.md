# @repo/images

Other sites' images (GitHub and Gravatar avatars, photos people link from
their resumes) served by jsonresume.org at the size a page shows them.

- `proxiedImage(src, width)` (`@repo/images/url`, safe in the browser) turns
  an `https://` image into `/_img/<width>/<source>.webp`. Widths are fixed
  (`IMAGE_WIDTHS`), 2x the avatar sizes.
- `createImageProxy({ cacheDir })` answers those paths: it downloads the
  source from the public web only (private and local addresses are refused
  when connecting, using `@repo/resume-pdf/policy`), at most 8MB, resizes it
  to a WebP square with sharp and keeps it in `cacheDir`. Responses are
  cached for a week by browsers and Cloudflare. Anything that isn't an image
  is a 404, and `Avatar` shows initials instead.

On the box, `cacheDir` is systemd's `CacheDirectory` (`/var/cache/jsonresume/app`).
