import { ProgressSteps } from '@jsonresume/ui';

export default function ProgressStepsWaiting() {
  return (
    <ProgressSteps
      label="Importing your resume"
      steps={[
        {
          id: 'fetch',
          label: 'Fetched resume.json from your gist',
          state: 'done',
        },
        {
          id: 'check',
          label: 'Checking it against the schema',
          detail: 'Usually a few seconds.',
          state: 'active',
        },
        { id: 'publish', label: 'Publishing your page', state: 'waiting' },
      ]}
    />
  );
}
