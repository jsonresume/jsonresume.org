import { DescriptionList, Stack } from '@jsonresume/ui';

const facts = [
  { term: 'Location', description: 'Remote (Americas)' },
  { term: 'Salary', description: '$180k–$220k' },
  { term: 'Type', description: 'Full-time' },
  { term: 'Posted', description: '3 days ago' },
];

export default function DescriptionListJob() {
  return (
    <Stack gap={8}>
      <DescriptionList items={facts} />
      <DescriptionList items={facts} layout="columns" />
    </Stack>
  );
}
