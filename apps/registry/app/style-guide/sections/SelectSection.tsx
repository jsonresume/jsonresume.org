import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { ComponentSection, Example, CodeBlock } from '../components';

export function SelectSection() {
  return (
    <ComponentSection
      title="Select"
      description="Dropdown select component for choosing from a list of options."
    >
      <Example title="Basic Select">
        <div className="max-w-xs">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Example>

      <CodeBlock
        code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`}
      />
    </ComponentSection>
  );
}
