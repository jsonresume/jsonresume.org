'use client';

import { Field, Input, Repeater, Textarea } from '@jsonresume/ui';
import { useState } from 'react';
import * as styles from './work.css';

interface Job {
  id: number;
  name: string;
  position: string;
  summary: string;
}

let nextId = 3;

export default function RepeaterWork() {
  const [work, setWork] = useState<Job[]>([
    {
      id: 1,
      name: 'Pied Piper',
      position: 'CEO',
      summary: 'Built a compression platform.',
    },
    { id: 2, name: 'Hooli', position: 'Engineer', summary: '' },
  ]);
  return (
    <div className={styles.root}>
      <Repeater
        items={work}
        onChange={setWork}
        getKey={(job) => job.id}
        create={() => ({ id: nextId++, name: '', position: '', summary: '' })}
        itemLabel={(job) =>
          [job.position, job.name].filter(Boolean).join(' at ') ||
          'New position'
        }
        noun="position"
        addLabel="Add position"
        renderItem={(job, update) => (
          <>
            <Field label="Company">
              <Input
                value={job.name}
                onChange={(e) => update({ ...job, name: e.target.value })}
              />
            </Field>
            <Field label="Position">
              <Input
                value={job.position}
                onChange={(e) => update({ ...job, position: e.target.value })}
              />
            </Field>
            <Field label="Summary">
              <Textarea
                value={job.summary}
                onChange={(e) => update({ ...job, summary: e.target.value })}
              />
            </Field>
          </>
        )}
      />
    </div>
  );
}
