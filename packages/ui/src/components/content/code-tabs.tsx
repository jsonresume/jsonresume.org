import { cx } from '../../utils/cx';
import {
  CodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../interactive/interactive';
import * as s from './content.css';

// Apart from content.tsx: LinkCard is on every page (the 404 is in the main
// bundle), and these tabs would bring Radix along with it.
export interface CodeTab {
  /** Tab label, e.g. "npm". */
  label: string;
  code: string;
}

export interface CodeTabsProps {
  tabs: CodeTab[];
  /** Names the tab list, e.g. "Install with". */
  label: string;
  className?: string;
}

/** The same step written several ways (npm, pnpm, npx), one tab each. */
export function CodeTabs({ tabs, label, className }: CodeTabsProps) {
  const first = tabs[0]?.label;
  return (
    <Tabs defaultValue={first} className={cx(s.codeTabs, className)}>
      <TabsList aria-label={label}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <CodeBlock code={tab.code} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
