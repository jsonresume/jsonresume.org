'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from '../display/display';
import * as s from './viz.css';

export interface PreviewFrameProps {
  /** Accessible name: "Resume preview, Pro theme". */
  title: string;
  /** A URL to load… */
  src?: string;
  /** …or an HTML document to render. */
  srcDoc?: string;
  /** Page width the content is laid out at (A4 at 96dpi by default); it scales to fit. */
  pageWidth?: number;
  /** Visible height in px, or 'fill' to take the container's height. */
  height?: number | 'fill';
  /** A new render is on its way: the current one dims and a spinner shows. */
  busy?: boolean;
  /** Rendered themes don't need scripts; enable only for trusted content. */
  allowScripts?: boolean;
}

/**
 * A sandboxed live preview of a rendered resume, laid out at page width and
 * scaled to fit its container.
 */
export function PreviewFrame({
  title,
  src,
  srcDoc,
  pageWidth = 794,
  height = 560,
  busy = false,
  allowScripts = false,
}: PreviewFrameProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [filled, setFilled] = useState(560);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => {
      setScale(Math.min(1, el.clientWidth / pageWidth));
      setFilled(el.clientHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageWidth]);
  return (
    <div
      ref={viewport}
      className={cx(s.previewViewport, height === 'fill' && s.previewFill)}
      style={
        height === 'fill'
          ? undefined
          : assignInlineVars({ [s.frameHeight]: `${height}px` })
      }
      aria-busy={busy || undefined}
    >
      {busy ? (
        <span className={s.previewStatus}>
          <Spinner label="Updating preview" />
        </span>
      ) : null}
      <iframe
        className={cx(s.previewFrame, busy && s.previewBusy)}
        title={title}
        src={src}
        srcDoc={srcDoc}
        sandbox={allowScripts ? 'allow-scripts allow-same-origin' : ''}
        width={pageWidth}
        height={(height === 'fill' ? filled : height) / scale}
        style={assignInlineVars({ [s.scale]: String(scale) })}
      />
    </div>
  );
}
