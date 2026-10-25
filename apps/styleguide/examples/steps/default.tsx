import { Step, Steps } from '@jsonresume/ui';

export default function StepsDefault() {
  return (
    <Steps>
      <Step title="Write resume.json">
        Describe your career once, in JSON that follows the schema.
      </Step>
      <Step title="Pick a theme">
        Preview it in any of the community themes.
      </Step>
      <Step title="Publish">Host it on the registry or export a PDF.</Step>
    </Steps>
  );
}
