import {
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@jsonresume/ui';

export default function TabsFormats() {
  return (
    <Tabs defaultValue="json">
      <TabsList aria-label="Resume format">
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="yaml">YAML</TabsTrigger>
      </TabsList>
      <TabsContent value="json">
        <CodeBlock
          label="resume.json"
          code={'{\n  "basics": { "name": "Ada Lovelace" }\n}'}
        />
      </TabsContent>
      <TabsContent value="yaml">
        <CodeBlock label="resume.yaml" code={'basics:\n  name: Ada Lovelace'} />
      </TabsContent>
    </Tabs>
  );
}
