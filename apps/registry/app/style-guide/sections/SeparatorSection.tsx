import { Separator } from '@repo/ui';
import { ComponentSection, Example, CodeBlock } from '../components';

export function SeparatorSection() {
  return (
    <ComponentSection
      title="Separator"
      description="Visual divider for separating content sections."
    >
      <Example title="Horizontal Separator">
        <div className="max-w-md space-y-4">
          <p className="text-gray-700">Section above</p>
          <Separator />
          <p className="text-gray-700">Section below</p>
        </div>
      </Example>

      <CodeBlock
        code={`<p>Section above</p>
<Separator />
<p>Section below</p>`}
      />

      <Example title="Vertical Separator">
        <div className="flex gap-4 items-center h-12">
          <span className="text-gray-700">Left</span>
          <Separator orientation="vertical" />
          <span className="text-gray-700">Middle</span>
          <Separator orientation="vertical" />
          <span className="text-gray-700">Right</span>
        </div>
      </Example>

      <CodeBlock
        code={`<div className="flex gap-4 items-center h-12">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>`}
      />
    </ComponentSection>
  );
}
