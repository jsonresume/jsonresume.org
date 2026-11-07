import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jsonresume/ui';
import { mcp } from '@repo/content/pages';
import { useEffect, useState } from 'react';
import { Client } from './Client';
import * as s from './mcp.css';

const first = mcp.guides[0]?.id ?? '';

/** The tab a link's #hash means: a guide (#cursor) or a client in one (#claude-code). */
export const guideFor = (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  return mcp.guides.find(
    (g) => g.id === id || g.clients.some((c) => c.id === id)
  )?.id;
};

/**
 * Setup for the main clients, a tab each. Every tab's steps are in the
 * page's HTML (hidden until chosen), so search engines and find-in-page
 * see them all. A link to /mcp#cursor opens Cursor's.
 */
export function ConnectGuides() {
  const [tab, setTab] = useState(first);
  useEffect(() => {
    const follow = () => {
      const id = guideFor(window.location.hash);
      if (id) setTab(id);
    };
    follow();
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, []);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList aria-label="Choose your app">
        {mcp.guides.map((guide) => (
          <TabsTrigger key={guide.id} value={guide.id}>
            {/* The target of /mcp#<guide>, kept off Radix's own ids. */}
            <span id={guide.id} className={s.anchor} />
            {guide.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {mcp.guides.map((guide) => (
        <TabsContent
          key={guide.id}
          value={guide.id}
          forceMount
          className={s.panel}
        >
          {guide.clients.map((client) => (
            <Client key={client.id} client={client} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
