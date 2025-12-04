import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { ComponentSection, Example, CodeBlock } from '../components';

export function AvatarSection() {
  return (
    <ComponentSection
      title="Avatar"
      description="User profile image with fallback support."
    >
      <Example title="Avatar with Image">
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/thomasdavis.png" />
            <AvatarFallback>TD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="invalid-url" />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
        </div>
      </Example>

      <CodeBlock
        code={`<Avatar>
  <AvatarImage src="https://github.com/thomasdavis.png" />
  <AvatarFallback>TD</AvatarFallback>
</Avatar>`}
      />
    </ComponentSection>
  );
}
