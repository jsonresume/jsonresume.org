import { Field, Select } from '@jsonresume/ui';

export default function SelectBasic() {
  return (
    <Field label="Theme" style={{ width: 'min(100%, 16rem)' }}>
      <Select defaultValue="pro">
        <option value="pro">Pro</option>
        <option value="even">Even</option>
        <option value="elegant">Elegant</option>
        <option value="flat">Flat</option>
      </Select>
    </Field>
  );
}
