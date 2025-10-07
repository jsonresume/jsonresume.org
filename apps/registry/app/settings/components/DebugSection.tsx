import { ScrollArea } from '@repo/ui';

interface DebugSectionProps {
  githubIdentity: any;
  userMetadata: any;
  appMetadata: any;
}

export const DebugSection = ({
  githubIdentity,
  userMetadata,
  appMetadata,
}: DebugSectionProps) => {
  return (
    <div className="mt-8">
      <h2 className="font-semibold mb-2">Debug Information</h2>
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium">GitHub Identity</h3>
        <ScrollArea className="h-40 rounded border">
          <pre className="text-sm p-2">
            {JSON.stringify(githubIdentity, null, 2)}
          </pre>
        </ScrollArea>
        <h3 className="font-medium mt-2">User Metadata</h3>
        <ScrollArea className="h-40 rounded border">
          <pre className="text-sm p-2">
            {JSON.stringify(userMetadata, null, 2)}
          </pre>
        </ScrollArea>
        <h3 className="font-medium mt-2">App Metadata</h3>
        <ScrollArea className="h-40 rounded border">
          <pre className="text-sm p-2">
            {JSON.stringify(appMetadata, null, 2)}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
};
