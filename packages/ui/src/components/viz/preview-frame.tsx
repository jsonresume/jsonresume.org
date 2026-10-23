'use client';

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useEffect, useRef, useState } from 'react';
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
  /** Visible height in px. */
  height?: number;
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
  allowScripts = false,
}: PreviewFrameProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / pageWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageWidth]);
  return (
    <div
      ref={viewport}
      className={s.previewViewport}
      style={assignInlineVars({ [s.frameHeight]: `${height}px` })}
    >
      <iframe
        className={s.previewFrame}
        title={title}
        src={src}
        srcDoc={srcDoc}
        sandbox={allowScripts ? 'allow-scripts allow-same-origin' : ''}
        width={pageWidth}
        height={height / scale}
        style={assignInlineVars({ [s.scale]: String(scale) })}
      />
    </div>
  );
}
