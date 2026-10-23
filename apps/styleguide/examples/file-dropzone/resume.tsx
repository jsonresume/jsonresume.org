'use client';

import { FileDropzone, FileList, Stack } from '@jsonresume/ui';
import { useState } from 'react';

export default function FileDropzoneResume() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Stack gap={3}>
      <FileDropzone
        accept=".pdf,.json"
        maxSize={5 * 1024 * 1024}
        title="Drop your resume here"
        hint="PDF or resume.json, up to 5 MB"
        onFiles={(incoming) => setFiles(incoming)}
      />
      <FileList
        files={files}
        onRemove={(f) => setFiles((all) => all.filter((x) => x !== f))}
      />
    </Stack>
  );
}
