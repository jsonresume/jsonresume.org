'use client';

import {
  Button,
  Checkbox,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  SearchField,
  Stack,
} from '@jsonresume/ui';
import * as styles from './anchor.css';

// PopoverAnchor lines the panel up with the whole search row instead of the
// small trigger; PopoverClose makes any button close it.
export default function PopoverAnchored() {
  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className={styles.row}>
          <SearchField
            aria-label="Search jobs"
            placeholder="Title or company"
            className={styles.search}
          />
          <PopoverTrigger asChild>
            <Button>Filters</Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent aria-label="Filters" className={styles.panel}>
        <Stack gap={4}>
          <Stack gap={3}>
            <Checkbox label="Remote" defaultChecked />
            <Checkbox label="Visa sponsorship" />
            <Checkbox label="Posted this week" />
          </Stack>
          <PopoverClose asChild>
            <Button variant="primary" size="sm">
              Done
            </Button>
          </PopoverClose>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}
