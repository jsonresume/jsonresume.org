import { ProgressSteps, Stack, Text, TreeMapSkeleton } from '@jsonresume/ui';
import * as styles from './loading.css';

export default function TreeMapLoading() {
  return (
    <div className={styles.frame}>
      <TreeMapSkeleton label="Your skills map">
        <Stack gap={2}>
          <Text weight="semibold">Growing your map</Text>
          <ProgressSteps
            label="What’s left"
            steps={[
              { id: 'read', label: 'Reading your resume', state: 'done' },
              {
                id: 'jobs',
                label: 'Judging open jobs against it',
                detail: 'Usually under 30 seconds.',
                state: 'active',
              },
            ]}
          />
        </Stack>
      </TreeMapSkeleton>
    </div>
  );
}
