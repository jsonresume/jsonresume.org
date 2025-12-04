import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import {
  ComponentSection,
  Example,
  CodeBlock,
  PropsTable,
} from '../components';
import { Button } from '@repo/ui/button';

export function CardSection() {
  return (
    <div className="space-y-8">
      <ComponentSection
        title="Card"
        description="Container component for grouping related content with consistent styling."
      >
        <Example title="Basic Card">
          <Card className="max-w-md">
            <CardContent className="p-6">
              <p className="text-gray-700">
                This is a basic card with just content.
              </p>
            </CardContent>
          </Card>
        </Example>

        <CodeBlock
          code={`<Card>
  <CardContent className="p-6">
    <p>This is a basic card with just content.</p>
  </CardContent>
</Card>`}
        />

        <Example title="Card with Header">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Optional description text goes here
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Card content goes in the CardContent component.
              </p>
            </CardContent>
          </Card>
        </Example>

        <CodeBlock
          code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <p className="text-sm text-gray-600 mt-2">
      Optional description text goes here
    </p>
  </CardHeader>
  <CardContent>
    <p>Card content goes in the CardContent component.</p>
  </CardContent>
</Card>`}
        />

        <Example title="Card with Actions">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Confirm Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Are you sure you want to proceed with this action?
              </p>
              <div className="flex gap-3">
                <Button variant="default">Confirm</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </Example>

        <CodeBlock
          code={`<Card>
  <CardHeader>
    <CardTitle>Confirm Action</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="mb-4">
      Are you sure you want to proceed with this action?
    </p>
    <div className="flex gap-3">
      <Button variant="default">Confirm</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  </CardContent>
</Card>`}
        />

        <Example title="Grid of Cards">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Feature 1</h3>
                <p className="text-sm text-gray-600">Description here</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Feature 2</h3>
                <p className="text-sm text-gray-600">Description here</p>
              </CardContent>
            </Card>
          </div>
        </Example>

        <CodeBlock
          code={`<div className="grid grid-cols-2 gap-4">
  <Card>
    <CardContent className="p-6">
      <h3 className="font-semibold mb-2">Feature 1</h3>
      <p className="text-sm text-gray-600">Description here</p>
    </CardContent>
  </Card>
  <Card>
    <CardContent className="p-6">
      <h3 className="font-semibold mb-2">Feature 2</h3>
      <p className="text-sm text-gray-600">Description here</p>
    </CardContent>
  </Card>
</div>`}
        />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Components</h3>
          <PropsTable
            props={[
              {
                name: 'Card',
                type: 'component',
                description: 'Main container component',
              },
              {
                name: 'CardHeader',
                type: 'component',
                description: 'Header section with title and description',
              },
              {
                name: 'CardTitle',
                type: 'component',
                description: 'Styled title component',
              },
              {
                name: 'CardContent',
                type: 'component',
                description: 'Main content area',
              },
            ]}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Best Practices</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Use for grouping related information</li>
            <li>
              ✅ Add padding to CardContent with <code>className="p-6"</code>
            </li>
            <li>✅ Use CardHeader for titles and descriptions</li>
            <li>✅ Keep card content concise and scannable</li>
            <li>❌ Don't nest cards more than 2 levels deep</li>
          </ul>
        </div>
      </ComponentSection>
    </div>
  );
}
