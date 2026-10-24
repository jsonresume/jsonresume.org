import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@jsonresume/ui';
import { groups, prompts, tools, type McpGroup } from '@repo/mcp/catalog';
import * as s from './mcp.css';

const order = Object.keys(groups) as McpGroup[];

/** Every tool, by group, straight from the server's catalog. */
export function ToolGroups() {
  return (
    <div className={s.tools}>
      {order.map((group) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle level={3}>{groups[group].title}</CardTitle>
            <p className={s.toolText}>{groups[group].description}</p>
          </CardHeader>
          <CardContent>
            <ul className={s.toolList}>
              {tools
                .filter((t) => t.group === group)
                .map((t) => (
                  <li key={t.name}>
                    <span className={s.toolName}>{t.name}</span>{' '}
                    {t.writes ? (
                      <Badge tone="warning">changes things</Badge>
                    ) : null}
                    <p className={s.toolText}>{t.description}</p>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** The prompts: conversations an agent can start with one click. */
export function PromptList() {
  return (
    <ul className={s.toolList}>
      {prompts.map((p) => (
        <li key={p.name}>
          <span className={s.toolName}>{p.title}</span> <code>{p.name}</code>
          <p className={s.toolText}>{p.description}</p>
        </li>
      ))}
    </ul>
  );
}
