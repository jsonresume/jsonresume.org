import { Progress } from '@repo/ui/progress';
import { ComponentSection, Example, CodeBlock } from '../components';

export function ProgressSection() {
  return (
    <ComponentSection
      title="Progress"
      description="Visual progress indicator for loading and completion states."
    >
      <Example title="Progress Bars">
        <div className="space-y-6 max-w-md">
          <div>
            <p className="text-sm text-gray-600 mb-2">25% Complete</p>
            <Progress value={25} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">50% Complete</p>
            <Progress value={50} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">75% Complete</p>
            <Progress value={75} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">100% Complete</p>
            <Progress value={100} />
          </div>
        </div>
      </Example>

      <CodeBlock
        code={`<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />`}
      />
    </ComponentSection>
  );
}
