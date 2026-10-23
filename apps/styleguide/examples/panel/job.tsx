import { Button, DescriptionList, Panel, Text } from '@jsonresume/ui';
import { X } from 'lucide-react';
import * as styles from './job.css';

export default function PanelJob() {
  return (
    <Panel
      className={styles.root}
      title="Senior Engineer · Stripe"
      maxHeight="22rem"
      actions={
        <Button variant="ghost" size="icon" aria-label="Close panel">
          <X aria-hidden="true" />
        </Button>
      }
      footer={
        <>
          <Button variant="ghost">Hide</Button>
          <Button variant="primary">Apply</Button>
        </>
      }
    >
      <DescriptionList
        items={[
          { term: 'Location', description: 'Remote (Americas)' },
          { term: 'Salary', description: '$180k–$220k' },
        ]}
      />
      <Text className={styles.copy}>
        Build the payments platform used by millions of businesses. You&apos;ll
        own services end to end, from design reviews to on-call, and work
        closely with product and design. The body scrolls; the header and footer
        stay put.
      </Text>
    </Panel>
  );
}
