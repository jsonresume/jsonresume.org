'use client';

import { Prose, SplitView, Text } from '@jsonresume/ui';
import * as styles from './editor.css';

// Drag the divider, or focus it and use the arrow keys (Shift for bigger steps).
export default function SplitViewEditor() {
  return (
    <div className={styles.frame}>
      <SplitView paneLabels={['Editor', 'Preview']} defaultSizes={[45, 55]}>
        <div className={styles.pane}>
          <Text caps tone="muted">
            Editor
          </Text>
          <pre
            className={styles.code}
          >{`{\n  "basics": {\n    "name": "Ada Lovelace"\n  }\n}`}</pre>
        </div>
        <div className={styles.pane}>
          <Prose>
            <h2>Ada Lovelace</h2>
            <p>The preview updates as you type.</p>
          </Prose>
        </div>
      </SplitView>
    </div>
  );
}
