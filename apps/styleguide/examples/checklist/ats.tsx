import { Checklist } from '@jsonresume/ui';

export default function ChecklistAts() {
  return (
    <Checklist
      summary
      label="ATS checks"
      items={[
        {
          status: 'pass',
          title: 'Contact details present',
          description: 'Email, phone and location were found.',
        },
        { status: 'pass', title: 'Standard section headings' },
        {
          status: 'warn',
          title: 'Summary is long',
          description: '92 words. Aim for under 60.',
        },
        {
          status: 'fail',
          title: 'Missing dates on two roles',
          description: 'Add a start date to Hooli and Pied Piper.',
        },
      ]}
    />
  );
}
