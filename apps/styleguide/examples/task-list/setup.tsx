import { Button, TaskList } from '@jsonresume/ui';

export default function TaskListSetup() {
  return (
    <TaskList
      progress
      label="Set up your page"
      tasks={[
        {
          id: 'write',
          title: 'Write your resume',
          description: 'Add your work, skills and education.',
          done: true,
        },
        {
          id: 'theme',
          title: 'Choose a theme',
          description: 'Your page, PDF and timeline all use it.',
          done: false,
          action: (
            <Button size="sm" variant="secondary">
              Browse themes
            </Button>
          ),
        },
        {
          id: 'github',
          title: 'Link GitHub',
          description: 'Keep resume.json in a gist and your page follows it.',
          done: false,
          optional: true,
          action: (
            <Button size="sm" variant="secondary">
              Link GitHub
            </Button>
          ),
        },
      ]}
    />
  );
}
