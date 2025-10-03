import { useEffect } from 'react';
import schema from '../../schema';

export const useMonacoSetup = (monaco) => {
  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: 'http://json-schema.org/draft-07/schema#',
            fileMatch: ['*'],
            schema: schema,
          },
        ],
      });
    }
  }, [monaco]);
};
