'use client';

import { useState } from 'react';
import styles from './CreateResume.module.css';
import Button from './Button/Button';

export default function CreateResume({ createGist }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className={styles.container}>
      <div style={{ fontSize: '1.4rem', textAlign: 'center' }}>
        <br />
        <br />
        <br />
        You currently don&apos;t have a gist named resume.json. You will be able
        to find it at{' '}
        <a href="https://gist.github.com">https://gist.github.com</a>
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
