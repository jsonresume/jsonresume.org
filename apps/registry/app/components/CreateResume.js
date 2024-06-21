'use client';

import { useState } from 'react';
import styles from './CreateResume.module.css';
import Button from '@jsonresume/ui/Button';

export default function CreateResume({ createGist }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className={styles.container}>
      <div>
        <br />
        <br />
        <br />
        You currently don&apos;t have a gist named resume.json
        <br />
        <br />
        {!creating && (
          <Button
            onClick={async () => {
              setCreating(true);
              await createGist();
              // refresh window
              window.location.reload();
            }}
          >
            Create resume.json gist
          </Button>
        )}
        {creating && <div>Creating resume.json gist...</div>}
      </div>
    </div>
  );
}
