import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@jsonresume/ui';

export default function AccordionFaq() {
  return (
    <Accordion type="single" collapsible style={{ width: '100%' }}>
      <AccordionItem value="what">
        <AccordionTrigger>What is JSON Resume?</AccordionTrigger>
        <AccordionContent>
          An open, community-driven standard for writing a resume as JSON.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="host">
        <AccordionTrigger>Where is my resume hosted?</AccordionTrigger>
        <AccordionContent>
          The registry reads a gist named resume.json from your GitHub account.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="theme">
        <AccordionTrigger>How do I change the theme?</AccordionTrigger>
        <AccordionContent>
          Set meta.theme in your resume, or add ?theme=name to the URL.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
