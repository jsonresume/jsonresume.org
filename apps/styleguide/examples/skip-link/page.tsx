'use client';

import { Button, SkipLink } from '@jsonresume/ui';
import * as styles from './page.css';

// Tab into the frame, or press the button: the link appears top left and
// jumps past the navigation to the content.
export default function SkipLinkPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <SkipLink id="skip-link-demo-link" href="#skip-link-demo" />
        <nav aria-label="Example site" className={styles.nav}>
          <a href="#skip-link-demo">Themes</a>
          <a href="#skip-link-demo">Schema</a>
          <a href="#skip-link-demo">Jobs</a>
          <a href="#skip-link-demo">Docs</a>
        </nav>
        <div id="skip-link-demo" tabIndex={-1} className={styles.content}>
          Focus lands here, past the navigation.
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => document.getElementById('skip-link-demo-link')?.focus()}
      >
        Show the skip link
      </Button>
    </div>
  );
}
