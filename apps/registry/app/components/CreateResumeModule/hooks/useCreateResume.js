import { useState } from 'react';
import { useResume } from '../../providers/ResumeProvider';

export function useCreateResume(sampleResume) {
  const [creating, setCreating] = useState(false);
  const { createGist } = useResume();

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      await createGist(sampleResume);
      window.location.reload();
    } catch (error) {
      console.error('Error creating resume:', error);
      setCreating(false);
    }
  };

  return { creating, handleCreateResume };
}
