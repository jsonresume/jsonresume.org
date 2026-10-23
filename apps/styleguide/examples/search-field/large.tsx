import { SearchField } from '@jsonresume/ui';

// The large size matches the docs search on jsonresume.org.
export default function SearchFieldLarge() {
  return (
    <SearchField
      size="lg"
      aria-label="Search the documentation"
      placeholder="Search the documentation"
    />
  );
}
