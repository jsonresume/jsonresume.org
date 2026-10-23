import { Field, Textarea } from '@jsonresume/ui';

export default function TextareaBasic() {
  return (
    <Field
      label="Summary"
      hint="Two or three sentences about your work."
      style={{ width: 'min(100%, 28rem)' }}
    >
      <Textarea defaultValue="Full stack developer with 15+ years building products at startups and in open source." />
    </Field>
  );
}
