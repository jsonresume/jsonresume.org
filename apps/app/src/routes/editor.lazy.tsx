import { useSession } from '@repo/dashboard';
import { ResumeEditor } from '@repo/resume-editor';
import { createLazyRoute } from '@tanstack/react-router';

/** Its own chunk: the code editor and form only load here. */
export const EditorRoute = createLazyRoute('/dashboard/editor')({
  component: function EditorRouteComponent() {
    const { username } = useSession();
    return <ResumeEditor username={username} />;
  },
});
