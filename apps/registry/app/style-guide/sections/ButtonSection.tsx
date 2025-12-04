import { Button } from '@repo/ui/button';
import Link from 'next/link';
import {
  ComponentSection,
  Example,
  CodeBlock,
  PropsTable,
} from '../components';

export function ButtonSection() {
  return (
    <div className="space-y-8">
      <ComponentSection
        title="Button"
        description="Primary action component for user interactions. Built with accessibility in mind."
      >
        <Example title="Variants">
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </Example>

        <CodeBlock
          code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
        />

        <Example title="Sizes">
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🔍</Button>
          </div>
        </Example>

        <CodeBlock
          code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>`}
        />

        <Example title="Disabled State">
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
          </div>
        </Example>

        <CodeBlock
          code={`<Button disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>`}
        />

        <Example title="As Child (for Links)">
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/explore">Explore</Link>
            </Button>
            <Button variant="secondary" asChild>
              <a href="https://github.com">GitHub</a>
            </Button>
          </div>
        </Example>

        <CodeBlock
          code={`import Link from 'next/link';

<Button asChild>
  <Link href="/explore">Explore</Link>
</Button>

<Button variant="secondary" asChild>
  <a href="https://github.com">GitHub</a>
</Button>`}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Props</h3>
          <PropsTable
            props={[
              {
                name: 'variant',
                type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
                default: "'default'",
                description: 'Visual style of the button',
              },
              {
                name: 'size',
                type: "'default' | 'sm' | 'lg' | 'icon'",
                default: "'default'",
                description: 'Size of the button',
              },
              {
                name: 'asChild',
                type: 'boolean',
                default: 'false',
                description: 'Render as child element (useful for links)',
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable button interaction',
              },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Best Practices</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              ✅ Use <code>default</code> variant for primary actions
            </li>
            <li>
              ✅ Use <code>asChild</code> pattern for navigation buttons
            </li>
            <li>
              ✅ Use <code>size="icon"</code> for icon-only buttons
            </li>
            <li>❌ Don't nest interactive elements inside buttons</li>
            <li>❌ Don't use buttons for navigation (use asChild + Link)</li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Accessibility</h4>
          <ul className="space-y-2 text-sm text-green-800">
            <li>
              ✓ Uses native <code>&lt;button&gt;</code> element
            </li>
            <li>✓ Keyboard navigable (Enter, Space)</li>
            <li>✓ Proper focus states with visible outline</li>
            <li>✓ ARIA attributes supported via props</li>
          </ul>
        </div>
      </ComponentSection>
    </div>
  );
}
