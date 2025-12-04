import { Checkbox } from '@repo/ui/checkbox';
import { ComponentSection, Example, CodeBlock } from '../components';

export function CheckboxSection() {
  return (
    <ComponentSection
      title="Checkbox"
      description="Checkbox input for selections and toggles."
    >
      <Example title="Basic Checkbox">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm cursor-pointer">
              Accept terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" />
            <label htmlFor="newsletter" className="text-sm cursor-pointer">
              Subscribe to newsletter
            </label>
          </div>
        </div>
      </Example>

      <CodeBlock
        code={`<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm cursor-pointer">
    Accept terms and conditions
  </label>
</div>`}
      />
    </ComponentSection>
  );
}
