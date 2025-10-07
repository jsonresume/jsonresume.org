import gravatar from 'gravatar';
import { logger } from '@/lib/logger';

export const formatResumes = (data) => {
  return data.map((row) => {
    try {
      const resume = JSON.parse(row.resume);
      return {
        username: row.username,
        label: resume?.basics?.label,
        image:
          resume?.basics?.image ||
          gravatar.url(
            resume?.basics?.email || '',
            {
              s: '200',
              r: 'x',
              d: 'retro',
            },
            true
          ),
        name: resume?.basics?.name,
        location: resume?.basics?.location,
        updated_at: row.updated_at,
        created_at: row.created_at,
      };
    } catch (e) {
      logger.error(
        { error: e.message, username: row.username },
        'Error parsing resume'
      );
      return {
        username: row.username,
        label: 'Error parsing resume',
        image: gravatar.url('', { s: '200', r: 'x', d: 'retro' }, true),
        name: row.username,
        location: null,
        updated_at: row.updated_at,
        created_at: row.created_at,
      };
    }
  });
};
