import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { ComponentSection, Example, CodeBlock } from '../components';

export function TabsSection() {
  return (
    <ComponentSection
      title="Tabs"
      description="Organize content into tabbed interfaces."
    >
      <Example title="Basic Tabs">
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-4">
            <p className="text-gray-700">Account settings content goes here.</p>
          </TabsContent>
          <TabsContent value="password" className="mt-4">
            <p className="text-gray-700">
              Password settings content goes here.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <p className="text-gray-700">General settings content goes here.</p>
          </TabsContent>
        </Tabs>
      </Example>

      <CodeBlock
        code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content
  </TabsContent>
  <TabsContent value="password">
    Password settings content
  </TabsContent>
</Tabs>`}
      />
    </ComponentSection>
  );
}
