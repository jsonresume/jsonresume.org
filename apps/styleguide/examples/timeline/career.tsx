import { Timeline } from '@jsonresume/ui';

export default function TimelineCareer() {
  return (
    <Timeline
      label="Career"
      items={[
        {
          date: 'May 2021 – Present',
          title: 'Principal Engineer, AI',
          subtitle: 'Independent',
          description:
            'Agentic systems and document pipelines for an HR-tech SaaS.',
          current: true,
        },
        {
          date: '2018 – 2020',
          title: 'Senior JavaScript Developer',
          subtitle: 'Tokenized',
          description: 'Electron wallet with local key management.',
        },
        { date: '2014', title: 'Founded JSON Resume', subtitle: 'Open source' },
      ]}
    />
  );
}
