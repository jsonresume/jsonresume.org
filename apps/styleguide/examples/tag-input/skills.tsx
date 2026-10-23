'use client';

import { Field, TagInput } from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './skills.css';

export default function TagInputSkills() {
  const [skills, setSkills] = useState(['TypeScript', 'React', 'PostgreSQL']);
  return (
    <Field
      label="Skills"
      hint="Press Enter or comma to add. Paste a comma-separated list to add several."
      className={styles.root}
    >
      <TagInput
        value={skills}
        onValueChange={setSkills}
        placeholder="Add a skill"
        maxTags={12}
      />
    </Field>
  );
}
