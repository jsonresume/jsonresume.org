import { useState } from 'react';
import { logger } from '@/lib/logger';
import { useResume } from '../../../providers/ResumeProvider';

export function useCreateResume(sampleResume) {
  const [creating, setCreating] = useState(false);
  const { createGist } = useResume();

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      await createGist(sampleResume);
      window.location.reload();
    } catch (error) {
      logger.error({ error: error.message }, 'Error creating resume');
      setCreating(false);
    }
  };

  return { creating, handleCreateResume };
}
