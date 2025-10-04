import { Button } from '@repo/ui';
import { Github } from 'lucide-react';

interface GitHubButtonProps {
  onClick: () => void;
}

export const GitHubButton = ({ onClick }: GitHubButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
    >
      <Github className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
};
