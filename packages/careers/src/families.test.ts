import { expect, it } from 'vitest';
import { FAMILIES, familyName, familyPrompt, isFamily } from './families';

it('names each family once, and reads them back', () => {
  const keys = FAMILIES.map(([k]) => k);
  expect(new Set(keys).size).toBe(keys.length);
  expect(isFamily('backend')).toBe(true);
  expect(isFamily('wizard')).toBe(false);
  expect(familyName('eng_manager')).toBe('Engineering manager');
  expect(familyPrompt.split('\n')).toHaveLength(keys.length);
});
