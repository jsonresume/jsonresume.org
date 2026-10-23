import { Field, Textarea } from '@jsonresume/ui';
import * as styles from './basic.css';

export default function TextareaBasic() {
  return (
    <Field
      label="Summary"
      hint="Two or three sentences about your work."
      className={styles.root}
    >
      <Textarea defaultValue="Full stack developer with 15+ years building products at startups and in open source." />
    </Field>
  );
}
