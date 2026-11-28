import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { aiCatalog, PROTOCOL_VERSIONS, serverCard } from './serverCard';
import { disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

const meta = {
  'io.modelcontextprotocol/protocolVersion': '2026-07-28',
  'io.modelcontextprotocol/clientInfo': { name: 'test', version: '1' },
  'io.modelcontextprotocol/clientCapabilities': {},
};

describe('MCP 2026-07-28', () => {
  it('says its lists never change while it runs, so clients do not listen', async () => {
    const { handler, key } = await setup();
    // A reply comes as JSON, or as one event on a stream.
    const read = async (response: Response) => {
      const text = await response.text();
      const data = text.startsWith('data:')
        ? text.split('\n')[0]?.slice(5) ?? 'null'
        : text;
      return JSON.parse(data);
    };
    const post = async (method: string, params: object) =>
      read(
        await handler(
          new Request('http://x/mcp', {
            method: 'POST',
            headers: {
              authorization: `Bearer ${key}`,
              'content-type': 'application/json',
              accept: 'application/json, text/event-stream',
              'mcp-protocol-version': '2026-07-28',
              'mcp-method': method,
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method,
              params: { _meta: meta, ...params },
            }),
          })
        )
      );
    const discovered = await post('server/discover', {});
    // The server card promises what the server says it speaks.
    expect(discovered.result.supportedVersions).toEqual([...PROTOCOL_VERSIONS]);
    expect(discovered.result.capabilities).toMatchObject({
      tools: { listChanged: false },
      prompts: { listChanged: false },
    });
    const listen = await post('subscriptions/listen', {
      notifications: { toolsListChanged: true },
    });
    expect(listen.error).toMatchObject({ code: -32601 });
    const tools = await post('tools/list', {});
    expect(tools.result.tools.length).toBeGreaterThan(50);
  });

  it('has a server card matching the registry entry, and a catalog naming it', () => {
    const registry = JSON.parse(
      readFileSync(new URL('../server.json', import.meta.url), 'utf8')
    );
    const card = serverCard('https://jsonresume.org');
    for (const key of ['name', 'title', 'description', 'version', 'websiteUrl'])
      expect(card[key as keyof typeof card]).toEqual(registry[key]);
    expect(card.description.length).toBeLessThanOrEqual(100);
    expect(card.remotes[0]?.url).toBe(registry.remotes[0].url);
    expect(aiCatalog('https://jsonresume.org').entries).toEqual([
      {
        identifier: 'urn:air:jsonresume.org:mcp:jsonresume',
        type: 'application/mcp-server-card+json',
        url: 'https://jsonresume.org/mcp/server-card',
      },
    ]);
  });
});
