import { CodeBlock } from '@jsonresume/ui';

const sample = `{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "email": "john@gmail.com"
  }
}`;

export default function CodeBlockBasic() {
  return (
    <CodeBlock label="resume.json" code={sample} style={{ width: '100%' }} />
  );
}
