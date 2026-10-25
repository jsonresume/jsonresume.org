import {
  AppPage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@jsonresume/ui';
import { useState } from 'react';
import { useSession } from '../session';
import { Copilot } from './Copilot';
import { Directions } from './Directions';
import { Swipe } from './Swipe';
import { useCopilot } from './useCopilot';

type Tab = 'copilot' | 'directions' | 'swipe';

/**
 * /dashboard/pathways: where your career could go. A copilot that knows
 * your resume and today's jobs (and can change both), the directions open to
 * you, and the matching jobs to sort one by one.
 */
export function PathwaysPage() {
  const user = useSession();
  const copilot = useCopilot(user.username);
  const [tab, setTab] = useState<Tab>('copilot');
  const ask = (question: string) => {
    setTab('copilot');
    copilot.send(question);
  };

  return (
    <AppPage
      title="Pathways"
      description="Where your career could go next, from your resume and the jobs open today."
      fill={tab === 'copilot'}
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList aria-label="Pathways">
          <TabsTrigger value="copilot">Copilot</TabsTrigger>
          <TabsTrigger value="directions">Directions</TabsTrigger>
          <TabsTrigger value="swipe">Sort jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="copilot">
          <Copilot copilot={copilot} />
        </TabsContent>
        <TabsContent value="directions">
          <Directions onAsk={ask} />
        </TabsContent>
        <TabsContent value="swipe">
          <Swipe />
        </TabsContent>
      </Tabs>
    </AppPage>
  );
}
