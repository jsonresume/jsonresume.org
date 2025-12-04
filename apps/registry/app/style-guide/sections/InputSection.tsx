import { Input } from '@repo/ui';
import { Textarea } from '@repo/ui';
import {
  ComponentSection,
  Example,
  CodeBlock,
  PropsTable,
} from '../components';

export function InputSection() {
  return (
    <div className="space-y-8">
      <ComponentSection
        title="Input & Textarea"
        description="Form input components for text entry with consistent styling."
      >
        <Example title="Basic Input">
          <div className="max-w-md space-y-4">
            <Input type="text" placeholder="Enter your name" />
            <Input type="email" placeholder="email@example.com" />
            <Input type="password" placeholder="Password" />
          </div>
        </Example>

        <CodeBlock
          code={`<Input type="text" placeholder="Enter your name" />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />`}
        />

        <Example title="With Label">
          <div className="max-w-md space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
        </Example>

        <CodeBlock
          code={`<div>
  <label htmlFor="name" className="block text-sm font-medium mb-2">
    Full Name
  </label>
  <Input id="name" type="text" placeholder="John Doe" />
</div>`}
        />

        <Example title="Disabled State">
          <div className="max-w-md">
            <Input disabled placeholder="Disabled input" />
          </div>
        </Example>

        <CodeBlock code={`<Input disabled placeholder="Disabled input" />`} />

        <Example title="Textarea">
          <div className="max-w-md space-y-4">
            <Textarea placeholder="Enter your bio..." rows={3} />
            <Textarea placeholder="Long form content..." rows={6} />
          </div>
        </Example>

        <CodeBlock
          code={`<Textarea placeholder="Enter your bio..." rows={3} />
<Textarea placeholder="Long form content..." rows={6} />`}
        />

        <Example title="With Error State">
          <div className="max-w-md space-y-4">
            <div>
              <Input
                type="email"
                placeholder="email@example.com"
                className="border-red-500 focus-visible:ring-red-500"
              />
              <p className="text-sm text-red-500 mt-1">Invalid email address</p>
            </div>
          </div>
        </Example>

        <CodeBlock
          code={`<div>
  <Input
    type="email"
    placeholder="email@example.com"
    className="border-red-500 focus-visible:ring-red-500"
  />
  <p className="text-sm text-red-500 mt-1">Invalid email address</p>
</div>`}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Input Props</h3>
          <PropsTable
            props={[
              {
                name: 'type',
                type: "'text' | 'email' | 'password' | 'number' | ...",
                default: "'text'",
                description: 'HTML input type',
              },
              {
                name: 'placeholder',
                type: 'string',
                description: 'Placeholder text',
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable the input',
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes',
              },
            ]}
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Textarea Props</h3>
          <PropsTable
            props={[
              {
                name: 'rows',
                type: 'number',
                default: '3',
                description: 'Number of visible text rows',
              },
              {
                name: 'placeholder',
                type: 'string',
                description: 'Placeholder text',
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable the textarea',
              },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Best Practices</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Always pair inputs with labels for accessibility</li>
            <li>✅ Use appropriate input types (email, password, etc.)</li>
            <li>✅ Provide clear placeholder text</li>
            <li>✅ Show validation errors inline</li>
            <li>❌ Don't use placeholder as label replacement</li>
          </ul>
        </div>
      </ComponentSection>
    </div>
  );
}
