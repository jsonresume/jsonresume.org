import { useState } from 'react';
import * as s from './preview.css';

interface Props {
  src: string;
  /** Screenshot shown until the live page loads. */
  image: string;
  title: string;
  /** Key presses inside the page, so the arrows work after clicking it. */
  onKey: (event: KeyboardEvent) => void;
}

/**
 * Hearing keys inside the frame needs its window, which only a same-origin
 * page shares; others keep their keys.
 */
const listen = (frame: HTMLIFrameElement, onKey: Props['onKey']) => {
  if (
    new URL(frame.src, window.location.href).origin !== window.location.origin
  )
    return;
  frame.contentWindow?.addEventListener('keydown', onKey);
};

/** A theme rendering a real resume, over its screenshot while it loads. */
export function ThemeFrame({ src, image, title, onKey }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={s.frameBox} aria-busy={!loaded}>
      <img className={s.shot} src={image} alt="" />
      <iframe
        className={s.frame}
        data-loaded={loaded}
        src={src}
        title={title}
        onLoad={(event) => {
          setLoaded(true);
          listen(event.currentTarget, onKey);
        }}
      />
    </div>
  );
}
