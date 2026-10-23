import { Field, Select } from '@jsonresume/ui';
import * as styles from './basic.css';

export default function SelectBasic() {
  return (
    <Field label="Theme" className={styles.root}>
      <Select defaultValue="pro">
        <option value="pro">Pro</option>
        <option value="even">Even</option>
        <option value="elegant">Elegant</option>
        <option value="flat">Flat</option>
      </Select>
    </Field>
  );
}
