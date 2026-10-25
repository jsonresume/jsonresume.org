import { CodeBlock, Step, Steps } from '@jsonresume/ui';

export default function StepsVertical() {
  return (
    <Steps layout="vertical">
      <Step title="Create a resume">
        Writes a starter resume.json.
        <CodeBlock code="resume init" />
      </Step>
      <Step title="Check it">
        Validates against the schema.
        <CodeBlock code="resume validate" />
      </Step>
    </Steps>
  );
}
