import { history, team } from '@repo/content/data';
import { TeamPage } from '@repo/site/team';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/team')({
  component: () => <TeamPage team={team} history={history} />,
});
