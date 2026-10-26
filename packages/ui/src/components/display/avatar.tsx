'use client';

import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import * as s from './display.css';

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** The person's name: used for the alt text and the initials fallback. */
  name: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/**
 * A photo, or the person's initials when there is none or it won't load.
 * Photos are often hotlinked from other sites, so a failed one is common:
 * it is caught on error, or on mount when it failed before hydration.
 */
export function Avatar({
  src,
  name,
  size,
  shape,
  className,
  alt,
  onError,
  ...props
}: AvatarProps) {
  const image = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    const img = image.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(src ?? null);
  }, [src]);
  const showImage = Boolean(src) && failed !== src;
  return (
    <span className={cx(s.avatar({ size, shape }), className)}>
      {showImage ? (
        <img
          ref={image}
          className={s.avatarImage}
          src={src ?? undefined}
          alt={alt ?? name}
          // Lists of people (Explore) show dozens; load those near the screen.
          loading="lazy"
          decoding="async"
          // Image hosts (imgur among them) refuse hotlinks that carry a referrer.
          referrerPolicy="no-referrer"
          onError={(event) => {
            setFailed(src ?? null);
            onError?.(event);
          }}
          {...props}
        />
      ) : (
        // alt="" marks the name as shown beside it, so the initials stay quiet.
        <span
          role="img"
          aria-label={alt === '' ? undefined : name}
          aria-hidden={alt === '' ? true : undefined}
        >
          {initials(name)}
        </span>
      )}
    </span>
  );
}
