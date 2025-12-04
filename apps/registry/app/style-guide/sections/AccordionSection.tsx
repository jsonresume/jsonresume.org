import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui';
import { ComponentSection, Example, CodeBlock } from '../components';

export function AccordionSection() {
  return (
    <ComponentSection
      title="Accordion"
      description="Collapsible content sections for organizing information."
    >
      <Example title="Basic Accordion">
        <Accordion type="single" collapsible className="max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is JSON Resume?</AccordionTrigger>
            <AccordionContent>
              JSON Resume is an open-source initiative to create a JSON-based
              standard for resumes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I create a resume?</AccordionTrigger>
            <AccordionContent>
              Create a GitHub gist named resume.json and format it according to
              the JSON Resume schema.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it free to use?</AccordionTrigger>
            <AccordionContent>
              Yes, JSON Resume is completely free and open source.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <CodeBlock
        code={`<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is JSON Resume?</AccordionTrigger>
    <AccordionContent>
      JSON Resume is an open-source initiative...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How do I create a resume?</AccordionTrigger>
    <AccordionContent>
      Create a GitHub gist named resume.json...
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
      />
    </ComponentSection>
  );
}
