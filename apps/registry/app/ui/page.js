import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Badge } from '@repo/ui/components/ui/badge';
import { Separator } from '@repo/ui/components/ui/separator';

export default function UIStyleGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">UI Style Guide</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Basic Card</h3>
            <p>This is a basic card component with some content.</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Card with Badge</h3>
            <Badge>New</Badge>
            <p className="mt-2">A card showing badge integration.</p>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Text Input</label>
            <Input type="text" placeholder="Enter some text" />
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Heading 1
          </h1>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Heading 2
          </h2>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Heading 3
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            This is a regular paragraph of text. The quick brown fox jumps over
            the lazy dog.
          </p>
          <p className="text-sm text-muted-foreground">
            This is smaller text with a muted color.
          </p>
        </div>
      </section>
    </div>
  );
}
