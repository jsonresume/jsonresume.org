import { useAtomValue } from '@effect/atom-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Stack,
} from '@jsonresume/ui';
import { checkAts } from '@repo/ats';
import { AtsReportView } from '@repo/ats/ui';
import { currentResumeAtom } from '@repo/api-client';
import { AsyncResult } from 'effect/reactivity';
import { useMemo } from 'react';

/** How applicant tracking systems read the resume the page shows now. */
export function AtsCard() {
  const result = useAtomValue(currentResumeAtom);
  const resume = AsyncResult.isSuccess(result) ? result.value.resume : null;
  const report = useMemo(
    () => (resume === null ? undefined : checkAts(resume)),
    [resume]
  );
  if (!report) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle level={2}>How tracking systems read it</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap={5} align="start">
          <AtsReportView report={report} headingLevel={3} limit={3} />
          <Button asChild variant="secondary">
            <a href="/dashboard/editor?panel=check">Fix it in the editor</a>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
