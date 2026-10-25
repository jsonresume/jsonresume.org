import { useAtomValue } from '@effect/atom-react';
import { checkAts } from '@repo/ats';
import { AtsReportView } from '@repo/ats/ui';
import { useMemo } from 'react';
import * as s from './editor.css';
import { draftAtom } from './state';

/** The draft's ATS check, as it changes: what tracking systems will read. */
export function CheckPane() {
  const draft = useAtomValue(draftAtom);
  const report = useMemo(() => checkAts(draft), [draft]);
  return (
    <div className={s.check}>
      <AtsReportView report={report} />
    </div>
  );
}

/** The draft's ATS score, for the switch that shows the check. */
export function useAtsScore() {
  const draft = useAtomValue(draftAtom);
  return useMemo(() => checkAts(draft).score, [draft]);
}
