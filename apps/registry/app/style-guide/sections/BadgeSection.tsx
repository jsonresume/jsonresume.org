import { Badge } from '@repo/ui';
import {
  ComponentSection,
  Example,
  CodeBlock,
  PropsTable,
} from '../components';

export function BadgeSection() {
  return (
    <div className="space-y-8">
      <ComponentSection
        title="Badge"
        description="Small status indicators for labels, counts, and tags."
      >
        <Example title="Variants">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Example>

        <CodeBlock
          code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}
        />

        <Example title="Common Use Cases">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status indicators:</p>
              <div className="flex gap-2">
                <Badge>Active</Badge>
                <Badge variant="secondary">Pending</Badge>
                <Badge variant="destructive">Expired</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Count badges:</p>
              <div className="flex gap-2">
                <span className="text-gray-700">
                  Notifications <Badge>12</Badge>
                </span>
                <span className="text-gray-700">
                  Unread <Badge variant="destructive">5</Badge>
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Skill tags:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
              </div>
            </div>
          </div>
        </Example>

        <CodeBlock
          code={`// Status indicators
<Badge>Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Expired</Badge>

// Count badges
<span>Notifications <Badge>12</Badge></span>
<span>Unread <Badge variant="destructive">5</Badge></span>

// Skill tags
<Badge variant="secondary">React</Badge>
<Badge variant="secondary">TypeScript</Badge>`}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Props</h3>
          <PropsTable
            props={[
              {
                name: 'variant',
                type: "'default' | 'secondary' | 'destructive' | 'outline'",
                default: "'default'",
                description: 'Visual style of the badge',
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes',
              },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Best Practices</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Use for status indicators and counts</li>
            <li>✅ Keep badge text short (1-3 words max)</li>
            <li>✅ Use consistent variants across similar contexts</li>
            <li>❌ Don't use for clickable actions (use Button instead)</li>
            <li>❌ Don't overuse - can create visual clutter</li>
          </ul>
        </div>
      </ComponentSection>
    </div>
  );
}
