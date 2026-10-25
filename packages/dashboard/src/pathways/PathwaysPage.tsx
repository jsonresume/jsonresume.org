import {
  AppPage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@jsonresume/ui';
import { useAtom } from '@effect/atom-react';
import { optionParam, useAtomsInUrl } from '@repo/url-state';
import { Atom } from 'effect/reactivity';
import { useEffect } from 'react';
import { useSession } from '../session';
import { Copilot } from './Copilot';
import { Directions } from './Directions';
import { Swipe } from './Swipe';
import { useCopilot } from './useCopilot';

type Tab = 'copilot' | 'directions' | 'swipe';
const tabs: ReadonlyArray<string> = ['copilot', 'directions', 'swipe'];

/** ?tab=directions|swipe opens on that tab; the copilot is the default. */
const tabParamAtom = Atom.make<string | null>(null);
/**
 * ?ask= puts a question to the copilot on arrival (a job page's "Write a
 * cover letter"), then leaves the URL so a reload doesn't ask again.
 */
const askParamAtom = Atom.make<string | null>(null);
const bindings = [
  optionParam('tab', tabParamAtom),
  optionParam('ask', askParamAtom),
];

/**
 * /dashboard/pathways: where your career could go. A copilot that knows
 * your resume and today's jobs (and can change both), the directions open to
 * you, and the matching jobs to sort one by one.
 */
export function PathwaysPage() {
  const user = useSession();
  const copilot = useCopilot(user.username);
  useAtomsInUrl(bindings);
  const [tabParam, setTabParam] = useAtom(tabParamAtom);
  const [asked, setAsked] = useAtom(askParamAtom);
  const tab: Tab = tabs.includes(tabParam ?? '')
    ? (tabParam as Tab)
    : 'copilot';
  const setTab = (next: Tab) => setTabParam(next === 'copilot' ? null : next);
  const ask = (question: string) => {
    setTab('copilot');
    copilot.send(question);
  };
  useEffect(() => {
    if (!asked || copilot.busy) return;
    setAsked(null);
    ask(asked);
    // Once per question in the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked]);

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
